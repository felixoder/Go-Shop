package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	// "github.com/gorilla/mux"
	// "go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/bson"
)

type customer struct {
	Fname     string `json:"fname"`
	Phno      string `json:"phno"`
	Address   string `json:"address"`
	Pin       string `json:"pin"`
	City      string `json:"city"`
	Landmark  string `json:"landmark"`
	ProductId string `json:"productId"`
	IsPaid    bool   `json:"isPaid"`
}

var customerCollection *mongo.Collection



func init() {
	customerCollection = db().Database("goTest").Collection("customers")
}

func AddCustomer(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var person customer
	err := json.NewDecoder(r.Body).Decode(&person)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	person.IsPaid = true // Set isPaid to false by default

	fmt.Printf("User to be inserted: %+v\n", person) // Debug print

	insertResult, err := customerCollection.InsertOne(context.TODO(), person)
	if err != nil {
		log.Fatal(err)
		http.Error(w, "Failed to insert user", http.StatusInternalServerError)
		return
	}

	fmt.Println("Inserted a single customer-details: ", insertResult)
	json.NewEncoder(w).Encode(insertResult.InsertedID)
}



func GetCustomers(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// Define a slice to store retrieved customers
	var customers []customer

	// MongoDB cursor to iterate over query results
	cursor, err := customerCollection.Find(context.Background(), bson.M{})
	if err != nil {
		log.Fatal(err)
		http.Error(w, "Failed to fetch customers", http.StatusInternalServerError)
		return
	}
	defer cursor.Close(context.Background())

	// Iterate over cursor and decode documents into customers slice
	for cursor.Next(context.Background()) {
		var cust customer
		err := cursor.Decode(&cust)
		if err != nil {
			log.Fatal(err)
		}
		customers = append(customers, cust)
	}

	// Check for any errors during cursor iteration
	if err := cursor.Err(); err != nil {
		log.Fatal(err)
	}

	// Encode customers slice into JSON and send response
	json.NewEncoder(w).Encode(customers)
}