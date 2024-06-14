package main

import (
    "log"
    "net/http"
    "github.com/gorilla/mux"
    "github.com/tbxark/g4vercel"
)

// Middleware to enable CORS
func enableCors(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        log.Println("CORS middleware triggered for request to:", r.URL.Path)
        w.Header().Set("Access-Control-Allow-Origin", "*")
        w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
        if r.Method == "OPTIONS" {
            w.WriteHeader(http.StatusOK)
            return
        }
        next.ServeHTTP(w, r)
    })
}

// Handler to create Stripe checkout session for a product


func main() {
    r := mux.NewRouter()

    // Apply the enableCors middleware
    r.Use(enableCors)

    // Subrouter for /api routes
    api := r.PathPrefix("/api").Subrouter()

    // Define your API endpoints
    api.HandleFunc("/sign-up", signUp).Methods("POST")
    api.HandleFunc("/sign-in", signIn).Methods("POST")
    api.HandleFunc("/sign-out", signOut).Methods("POST")
    api.HandleFunc("/create-prod", createProducts).Methods("POST")
    api.HandleFunc("/get-prod", getProducts).Methods("GET")
    api.HandleFunc("/get-prod/{id}", getProductByID).Methods("GET")
    // api.HandleFunc("/update-paid/{id}", updatePaid).Methods("PUT")


    // Ensure the correct path for create-checkout-session
    api.HandleFunc("/create-checkout-session/{id}", handleCreateCheckoutSession).Methods("POST")
    api.HandleFunc("/create-cus",AddCustomer).Methods("POST")
    api.HandleFunc("/get-cus", GetCustomers).Methods("GET")

    // Start the server
    port := ":8000"
    log.Printf("Server listening on port %s", port)
    log.Fatal(http.ListenAndServe(port, r))
}
