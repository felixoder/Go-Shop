import { useNavigate, useParams } from 'react-router-dom';
import MaxWidthWrapper from './MaxWidthWrapper';
import { ChangeEvent, useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';

interface FormData {
  fname: string;
  phno: string;
  address: string;
  pin: string;
  city: string;
  landmark: string;
  productid: string;
}

type Product = {
  _id: string;
  product: string;
  description: string;
  image: string;
  price: string; // Price as string
};

const Success = () => {
  const [formData, setFormData] = useState<FormData>({ fname: '', phno: '', address: '', pin: '', city: '', landmark: '', productid: '' });
  const [product, setProduct] = useState<Product | null>(null);
  const navigate = useNavigate();
  const { productId } = useParams<{ productId: string }>();

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      productid: productId || '',
    }));

    const fetchProduct = async () => {
      try {
        const res = await axios.get(`https://go-shop-fbgh.onrender.com/api/get-prod/${productId}`);
        if (res.status === 200) {
          setProduct(res.data);
        } else {
          throw new Error('Failed to fetch product');
        }
      } catch (err) {
        toast.error('Product not found');
      }
    };

    fetchProduct();
  }, [productId]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (!formData.fname || !formData.phno || !formData.address || !formData.pin || !formData.city || !formData.landmark) {
      toast.error("All fields are required");
      return;
    }

    try {
      const res = await fetch('/api/create-cus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        toast.error("Failed to submit form");
      } else {
        toast.success("Form submitted successfully");
        navigate(`/order/${productId}`);
      }
    } catch (error) {
      toast.error("Failed to submit form");
    }
  };

  return (
    <MaxWidthWrapper className="flex mx-auto">
      <Toaster />
      <div className="w-full max-w-md mx-auto mt-10 mb-10">
        <h1 className="text-center font-bold text-xl">Add Your Address</h1>
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="fname"
              type="text"
              placeholder="Enter Your Name"
              value={formData.fname}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Product Id</label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="productid"
              type="text"
              value={formData.productid} // Set the value to formData.productid
              readOnly // Make the input read-only
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Phone Number</label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="phno"
              type="text"
              placeholder="63738393993"
              value={formData.phno}
              onChange={handleChange}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Address</label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="address"
              type="text"
              placeholder="xyz/ykh/"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Pin Code</label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="pin"
              type="text"
              placeholder="710000"
              value={formData.pin}
              onChange={handleChange}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">City</label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="city"
              type="text"
              placeholder="kolkata"
              value={formData.city}
              onChange={handleChange}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Landmark</label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="landmark"
              type="text"
              placeholder="Tower statue"
              value={formData.landmark}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Done!
            </button>
          </div>
        </form>
      </div>
    </MaxWidthWrapper>
  );
};

export default Success;
