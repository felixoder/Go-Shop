import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
type Product = {
  _id: string;
  product: string;
  description: string;
  image: string;
  price: string; // Price as string
};

const Products: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/api/get-prod/${productId}`);
        if (res.status === 200) {
          setProduct(res.data);
        } else {
          throw new Error('Failed to fetch product');
        }
      } catch (err) {
        toast.error('Product not found');
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchProduct();
  }, [productId]);

 

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="animate-spin w-12 h-12 text-green-600" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen text-2xl text-gray-700">
        Product not found
      </div>
    );
  }
  const handleCheckout = async () => {
    try {
      const response = await axios.post(`http://localhost:8000/api/create-checkout-session/${productId}`);
      const sessionId = response.data.id;

      // Initialize Stripe
      const stripe = await loadStripe('pk_test_51PRK9Z2Mr9crS3hzDmyQoEQnuUWO555sYUSGdEpxu3pAhGjxYSaNWjujgzWe3ub8T3FiCF5u5CHztwyh92qk51R200PsvewTyF'); // Replace with your actual publishable key

      // Redirect to Stripe Checkout page
      const { error } = await stripe.redirectToCheckout({
        sessionId: sessionId,
      });

      if (error) {
        console.error("Error:", error);
      }
    } catch (error) {
      console.error("Failed to create checkout session:", error);
    }
  };


  return (
    <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
        <img
          src={product.image}
          alt={product.product}
          className="w-full h-64 object-cover object-center"
        />
        <div className="p-6 sm:p-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
            {product.product}
          </h1>
          <p className="text-gray-600 text-lg mb-6">{product.description}</p>
          <p className="text-gray-800 text-xl font-semibold">Price: ${(parseInt(product.price) / 100).toFixed(2)}</p> {/* Price is displayed in dollars */}
          <button
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md"
            onClick={handleCheckout}
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Products;
