import React, { ChangeEvent, useState } from 'react';

import toast, {Toaster} from 'react-hot-toast'
interface ModalProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
}
type FormData = {
  product: string;
  description: string;
  image: string;
  price: string;
};


const AddModal: React.FC<ModalProps> = ({ show, onConfirm, onClose }) => {
  const [formData, setFormData] = useState<FormData>({ product: '', description: '', image:'',price:'' });
  if (!show) {
    return null;
  }


  const handleProdSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onConfirm();
  };


    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData({ ...formData, [e.target.id]: e.target.value});
    };
  
    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
      e.preventDefault();
      if (!formData.product || !formData.description || !formData.image || !formData.price) {
        
        toast.error("Failed")
      }
      try {
        const res = await fetch('https://go-shop-fbgh.onrender.com/api/create-prod', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (data.success === false) {
          toast.error("Failed")
        }
        if (res.ok) {
          onClose()
          toast.success("Awesome prod is added")

       
        }
      } catch (error) {
        toast.error("Sorry check again!")
      }
    };

  return (
    
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <Toaster/>
      <div className="w-full max-w-md mx-auto mt-10 mb-10 bg-white shadow-md rounded px-8 pt-6 pb-8">
        <h1 className="text-center font-bold text-xl mb-4">Add Product</h1>
        <p className='text-gray text-center text-sm'>Reload to get the new prods</p>
        <form onSubmit={handleSubmit} className="bg-white rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="product">
              Product Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="product"
              type="text"
              placeholder="Enter Your Product"
              value={formData.product}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
              Price
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="price"
              type="text"
              placeholder="Enter Price"
              value={formData.price}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
              Image
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="image"
              type="text"
              placeholder="Paste Image URL"
              value={formData.image}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
              Description
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="button"
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={onClose}
            >
              Close
            </button>
            <button
              type="submit"
              onSubmit={handleProdSubmit}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddModal;
