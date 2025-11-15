"use client";

import React from 'react';
import { useCart } from '@/context/CartContext';
import CartItem from '@/components/customer/CartItem';
import Link from 'next/link';

export default function CartPage() {
  const { cartItems, cartCount, totalPrice, clearCart } = useCart();

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8">Your Cart</h1>

      {cartCount === 0 ? (
        <div className="text-center">
          <p className="text-xl text-gray-600">Your cart is empty.</p>
          <Link href="/menu">
            <span className="text-primary-600 hover:underline mt-4 inline-block">
              Start ordering
            </span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">
                Items ({cartCount})
              </h2>
              <button
                onClick={clearCart}
                className="text-sm text-red-500 hover:underline"
              >
                Clear Cart
              </button>
            </div>
            <div>
              {cartItems.map((item, index) => (
                <CartItem
                  key={`${item._id}-${item.selectedPortion}-${index}`}
                  item={item}
                />
              ))}
            </div>
          </div>

          <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-md h-fit">
            <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
              Order Summary
            </h2>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold">${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Taxes (Est.)</span>
              <span className="font-semibold">$0.00</span>
            </div>
            <div className="flex justify-between font-bold text-xl mt-4 pt-4 border-t">
              <span>Total</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>

            {/* --- THIS IS THE FIX --- */}
            <Link href="/checkout">
              <span className="block w-full text-center bg-primary-600 text-white font-semibold py-3 rounded-lg hover:bg-primary-700 transition-colors mt-6">
                Proceed to Checkout
              </span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
