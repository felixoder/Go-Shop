package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
	"github.com/stripe/stripe-go/v72"
	"github.com/stripe/stripe-go/v72/checkout/session"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type product struct {
	ID          primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	Product     string             `json:"product"`
	Price       string             `json:"price"` // Store price as a string
	Image       string             `json:"image"`
	Description string             `json:"description"`
}

var (
	prodCollection  *mongo.Collection
	stripeSecretKey string
)



func init() {
	// Initialize MongoDB connection
	clientOptions := options.Client().ApplyURI("mongodb+srv://debayanghosh408:rMJPkHXLcBGlZIGd@cluster0.ot8dquf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
	client, err := mongo.Connect(context.Background(), clientOptions)
	if err != nil {
		log.Fatal(err)
	}

	prodCollection = client.Database("goTest").Collection("products")

	// Initialize Stripe secret key
	stripeSecretKey = "sk_test_51PRK9Z2Mr9crS3hzoaLg9PyZ63m1BsTEwDiMzK77elguXoSR3Yk90qvNJSeJv87fgRlMJrkzK9I9kv2LbMI2MjwW00jxCGdQFK"
	if stripeSecretKey == "" {
		log.Fatal("Stripe secret key not set")
	}

	// Initialize Stripe client with secret key
	stripe.Key = stripeSecretKey
}

// Handler to create products in MongoDB
func createProducts(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var prod product
	err := json.NewDecoder(r.Body).Decode(&prod)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	insertResult, err := prodCollection.InsertOne(context.TODO(), prod)
	if err != nil {
		log.Fatal(err)
		http.Error(w, "Failed to insert product", http.StatusInternalServerError)
		return
	}

	fmt.Println("Inserted a single product: ", insertResult)
	json.NewEncoder(w).Encode(insertResult)
}

// Handler to get all products from MongoDB
func getProducts(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var results []product
	cur, err := prodCollection.Find(context.TODO(), bson.D{{}})
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer cur.Close(context.TODO())

	for cur.Next(context.TODO()) {
		var elem product
		err := cur.Decode(&elem)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		results = append(results, elem)
	}
	if err := cur.Err(); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(results)
}

// Handler to get product by ID from MongoDB
func getProductByID(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	params := mux.Vars(r)
	id, err := primitive.ObjectIDFromHex(params["id"])
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	var result product
	err = prodCollection.FindOne(context.TODO(), bson.M{"_id": id}).Decode(&result)
	if err != nil {
		http.Error(w, "Product not found", http.StatusNotFound)
		return
	}

	json.NewEncoder(w).Encode(result)
}

// Handler to create Stripe checkout session for a product
func handleCreateCheckoutSession(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	params := mux.Vars(r)
	id, err := primitive.ObjectIDFromHex(params["id"])
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	// Fetch product from MongoDB
	var prod product
	err = prodCollection.FindOne(context.TODO(), bson.M{"_id": id}).Decode(&prod)
	if err != nil {
		http.Error(w, "Product not found", http.StatusNotFound)
		return
	}

	// Convert price from string to integer (in cents)
	priceInCents, err := strconv.Atoi(prod.Price)
	if err != nil {
		http.Error(w, "Invalid price format", http.StatusBadRequest)
		return
	}

	// Define checkout session parameters
	checkoutParams := &stripe.CheckoutSessionParams{
		PaymentMethodTypes: stripe.StringSlice([]string{"card"}),
		LineItems: []*stripe.CheckoutSessionLineItemParams{
			{
				PriceData: &stripe.CheckoutSessionLineItemPriceDataParams{
					Currency: stripe.String("usd"),
					ProductData: &stripe.CheckoutSessionLineItemPriceDataProductDataParams{
						Name: stripe.String(prod.Product),
					},
					UnitAmount: stripe.Int64(int64(priceInCents)), // Use product price in cents
				},
				Quantity: stripe.Int64(1),
			},
		},
		Mode:       stripe.String(string(stripe.CheckoutSessionModePayment)),
		SuccessURL: stripe.String("go-shop-3.onrender.com/success/" + prod.ID.Hex()), // Dynamic success URL
		CancelURL:  stripe.String("go-shop-3.onrender.com/failure"),
	}

	// Create Stripe checkout session
	sess, err := session.New(checkoutParams)
	if err != nil {
		log.Printf("Failed to create session: %v", err)
		http.Error(w, "Failed to create session", http.StatusInternalServerError)
		return
	}

	// Respond with the session ID
	json.NewEncoder(w).Encode(map[string]string{"id": sess.ID})
}
