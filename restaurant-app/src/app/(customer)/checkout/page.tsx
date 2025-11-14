"use client";

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { cartItems, totalPrice, clearCart } = useCart();
  const router = useRouter();

  // State for the form
  const [tableNumber, setTableNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');

  // State for submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // This is a placeholder. In a real app, you'd get this from
  // the QR scan or a context.
  const MOCK_TABLE_ID = "60d0fe4f5311236168a109cb"; // Replace with a real-looking Mongo ID

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tableNumber) {
      setError('Please enter your table number.');
      return;
    }
    if (cartItems.length === 0) {
      setError('Your cart is empty.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    // 1. Format the order items for the API
    const orderItems = cartItems.map((item) => ({
      menu_item_id: item._id,
      quantity: item.quantity,
      portion: item.selectedPortion,
      special_instructions: "", // You can add a field for this per-item
      price: item.itemPrice * item.quantity,
    }));

    // 2. Create the order payload
    const orderPayload = {
      table_id: MOCK_TABLE_ID, // Using mock table ID
      items: orderItems,
      notes: specialInstructions,
    };

    try {
      // 3. Call the API endpoint
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to place order.');
      }

      const data = await res.json();

      // 4. Handle success
      clearCart();
      // Redirect to the order status page
      router.push(`/orders/${data.order_id}`); 
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold text-center mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Customer Details Form */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Your Details</h2>
          <form onSubmit={handleSubmitOrder}>
            <div className="mb-4">
              <label htmlFor="tableNumber" className="block text-sm font-medium text-gray-700">
                Table Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="tableNumber"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="customerName" className="block text-sm font-medium text-gray-700">
                Your Name (Optional)
              </label>
              <input
                type="text"
                id="customerName"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="specialInstructions" className="block text-sm font-medium text-gray-700">
                Special Instructions (Optional)
              </label>
              <textarea
                id="specialInstructions"
                rows={3}
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., allergies, extra spicy..."
              />
            </div>

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <button
              type="submit"
              disabled={isSubmitting || cartItems.length === 0}
              className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
            >
              {isSubmitting ? 'Placing Order...' : 'Place Order'}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="bg-white p-6 rounded-lg shadow-md h-fit">
          <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
          <div className="max-h-64 overflow-y-auto mb-4 border-b">
            {cartItems.map((item) => (
              <div key={`${item._id}-${item.selectedPortion}`} className="flex justify-between items-center py-2">
                <div>
                  <p className="font-medium">{item.name} <span className="text-gray-500">x{item.quantity}</span></p>
                  <p className="text-sm text-gray-600 capitalize">{item.selectedPortion}</p>
                </div>
                <span className="font-medium">${(item.itemPrice * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between font-bold text-xl mt-4 pt-4 border-t">
            <span>Total</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
