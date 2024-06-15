import  { useEffect, useState } from 'react';
import {  useParams } from 'react-router-dom';
import axios from 'axios';
import {Loader} from 'lucide-react'; // Assume there's a Loader component
import MaxWidthWrapper from './MaxWidthWrapper';

type Product = {
  _id: string;
  product: string;
  description: string;
  image: string;
  price: string; // Price as string
};

const Checkout = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { productId } = useParams<{ productId: string }>();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`https://go-shop-fbgh.onrender.com/api/get-prod/${productId}`);
        if (res.status === 200) {
          setProduct(res.data);
        } else {
          throw new Error('Failed to fetch product');
        }
      } catch (err) {
        console.error('Product not found', err);
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
        Not found
      </div>
    );
  }

  return (
    <MaxWidthWrapper>
 <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-4">Your Order is Successful</h1>
      <p className='mb-4 mt-2 text-bold text-red-800 capitalize underline'>{product.product}</p>
      <p className="mb-4">{product.description}</p>
      <img src={product.image} alt={product.product} className="mb-4 h-[300px] w-[500px] object-cover" />
      <p className="mb-4 text-xl font-semibold">{product.price} INR</p>
     
    </div>

    </MaxWidthWrapper>
   
  );
};

export default Checkout;
