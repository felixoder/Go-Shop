package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"golang.org/x/crypto/bcrypt"
)

// User struct for storing data
type user struct {
	Email    string `json:"email"`
	Password string `json:"password"`
	IsAdmin  bool   `json:"isAdmin"` // Add isAdmin field
}

var userCollection = db().Database("goTest").Collection("users")



// signUp handles user registration
func signUp(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var person user
	err := json.NewDecoder(r.Body).Decode(&person)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Ensure isAdmin is set to false by default if not provided
	if !person.IsAdmin {
		person.IsAdmin = false
	}

	fmt.Printf("User to be inserted: %+v\n", person) // Debug print

	// Hash the password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(person.Password), bcrypt.DefaultCost)
	if err != nil {
		http.Error(w, "Failed to hash password", http.StatusInternalServerError)
		return
	}
	person.Password = string(hashedPassword)

	insertResult, err := userCollection.InsertOne(context.TODO(), person)
	if err != nil {
		log.Fatal(err)
		http.Error(w, "Failed to insert user", http.StatusInternalServerError)
		return
	}

	fmt.Println("Inserted a single document: ", insertResult)
	json.NewEncoder(w).Encode(insertResult.InsertedID)
}

// signIn handles user authentication and sets a cookie
func signIn(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var input user
	err := json.NewDecoder(r.Body).Decode(&input)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Find user by email
	var result user
	err = userCollection.FindOne(context.TODO(), bson.M{"email": input.Email}).Decode(&result)
	if err != nil {
		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		return
	}

	// Compare hashed password with input password
	err = bcrypt.CompareHashAndPassword([]byte(result.Password), []byte(input.Password))
	if err != nil {
		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		return
	}

	// Passwords match, set a cookie (example)
	expiration := time.Now().Add(24 * time.Hour) // Example: cookie valid for 1 day
	cookie := http.Cookie{
		Name:     "session",
		Value:    "authenticated",
		Expires:  expiration,
		HttpOnly: true,
		SameSite: http.SameSiteStrictMode,
	}
	http.SetCookie(w, &cookie)

	json.NewEncoder(w).Encode(map[string]interface{}{
		"email":   result.Email,
		"isAdmin": result.IsAdmin,
	})
}

// signOut handles user logout
func signOut(w http.ResponseWriter, r *http.Request) {
	cookie := http.Cookie{
		Name:     "session",
		Value:    "",
		Expires:  time.Now().Add(-1 * time.Hour),
		HttpOnly: true,
		SameSite: http.SameSiteStrictMode,
	}
	http.SetCookie(w, &cookie)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Logged out successfully"})
}


