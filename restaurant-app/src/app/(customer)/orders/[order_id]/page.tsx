"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { IOrder } from '@/types'; // Import our Order type
import Link from 'next/link';
import { socket } from '@/lib/socket'; // Import the socket client

export default function OrderStatusPage() {
  const params = useParams();
  const order_id = params.order_id as string;

  const [order, setOrder] = useState<IOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!order_id) return;

    // 1. Fetch the initial order data
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/orders/${order_id}`);
        if (!res.ok) {
          throw new Error('Order not found.');
        }
        const data = await res.json();
        setOrder(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();

    // --- REAL-TIME LISTENER ---
    // 2. Connect to the socket server
    socket.connect();

    // 3. Listen for updates *to this specific order*
    const eventName = `order:${order_id}`;
    
    const onStatusUpdate = (newStatus: IOrder['status']) => {
      console.log('Received status update!', newStatus);
      // Update the status on the page
      setOrder((prevOrder) => {
        if (!prevOrder) return null;
        return { ...prevOrder, status: newStatus };
      });
    };

    socket.on(eventName, onStatusUpdate);

    // 4. Cleanup function to run when the component unmounts
    return () => {
      console.log('Disconnecting from socket');
      socket.off(eventName, onStatusUpdate); // Stop listening for this specific event
      socket.disconnect();
    };
    // --- END REAL-TIME ---

  }, [order_id]); // Dependency array ensures this runs once per order ID

  // Helper function for styling the status badge
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-200 text-yellow-800';
      case 'confirmed': return 'bg-blue-200 text-blue-800';
      case 'preparing': return 'bg-indigo-200 text-indigo-800';
      case 'ready': return 'bg-green-200 text-green-800';
      case 'served': return 'bg-green-500 text-white';
      case 'cancelled': return 'bg-red-200 text-red-800';
      default: return 'bg-gray-200 text-gray-800';
    }
  };

  if (loading) {
    return <div className="text-center p-10">Loading your order...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-500">Error: {error}</div>;
  }

  if (!order) {
    return <div className="text-center p-10">Order not found.</div>;
  }

  // --- Render Page ---
  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center mb-4">Order Received!</h1>
        <p className="text-center text-gray-600 mb-6">
          Thank you for your order. We're working on it!
        </p>

        <div className="text-center mb-8">
          <p className="text-lg font-medium">Current Status:</p>
          <span
            className={`text-xl font-bold capitalize px-4 py-2 rounded-full transition-all ${getStatusClass(
              order.status
            )}`}
          >
            {order.status}
          </span>
          <p className="text-sm text-gray-500 mt-2">
            Your order will be updated in real-time.
          </p>
        </div>

        <div className="border-t pt-4">
          <h2 className="text-xl font-semibold mb-3">Order Summary</h2>
          <div className="space-y-2 mb-4">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between">
                <div>
                  <p className="font-medium">{item.name} <span className="text-gray-500">x{item.quantity}</span></p>
                  <p className="text-sm text-gray-600 capitalize">{item.portion}</p>
                </div>
                <span className="font-medium">${item.price.toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between font-bold text-xl mt-4 pt-4 border-t">
            <span>Total</span>
            <span>${order.total_amount.toFixed(2)}</span>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link href="/(customer)/menu">
            <span className="text-blue-600 hover:underline">
              &larr; Back to Menu
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}