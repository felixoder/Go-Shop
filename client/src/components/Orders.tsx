import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MaxWidthWrapper from './MaxWidthWrapper';

type Order = {
  _id: string;
  productId: string;
  fname: string;
  address: string;
  phno: string;
  pin: string;
  city: string;
  landmark: string;
  isPaid: boolean; // Include isPaid field
};

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('https://go-shop-fbgh.onrender.com/api/get-cus'); // Replace with your actual API endpoint
        console.log('Response:', response.data); // Check the response data in console
        setOrders(response.data);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div>
      <MaxWidthWrapper>
        <h1 className="text-2xl font-bold mb-4">Orders List</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border-collapse border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Product ID</th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Customer Name</th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Address</th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Ph-no</th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Pin</th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">City</th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Landmark</th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Paid</th>
                {/* Add more headers as per your order schema */}
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {orders.map(order => (
                <tr key={order._id}>
                  <td className="border border-gray-200 py-2 px-4">{order.productId}</td>
                  <td className="border border-gray-200 py-2 px-4">{order.fname}</td>
                  <td className="border border-gray-200 py-2 px-4">{order.address}</td>
                  <td className="border border-gray-200 py-2 px-4">{order.phno}</td>
                  <td className="border border-gray-200 py-2 px-4">{order.pin}</td>
                  <td className="border border-gray-200 py-2 px-4">{order.city}</td>
                  <td className="border border-gray-200 py-2 px-4">{order.landmark}</td>
                  <td className="border border-gray-200 py-2 px-4">{order.isPaid ? (<> <button className="text-white bg-green-600 w-9 text-sm font-bold rounded-md">Paid</button></>) : (<><button className="text-white bg-red rounded-md">Not-Paid</button></>)}</td>
                  {/* Render more columns as per your order schema */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </MaxWidthWrapper>
    </div>
  );
};

export default Orders;
