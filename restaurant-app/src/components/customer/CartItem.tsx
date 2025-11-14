"use client";

import React from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
// Import the CartItem type from the context file
import { CartItem as CartItemType } from '@/context/CartContext'; 

// Use the imported type for the props
type CartItemProps = {
  item: CartItemType;
};

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (newQuantity: number) => {
    // Use the correct property: selectedPortion
    updateQuantity(item._id, item.selectedPortion, newQuantity);
  };

  const handleRemove = () => {
    // Use the correct property: selectedPortion
    removeFromCart(item._id, item.selectedPortion);
  };

  return (
    <div className="flex items-center border-b py-4">
      {/* Image */}
      <div className="relative w-24 h-24 rounded-md overflow-hidden mr-4">
        <Image
          src={item.image_url || '/placeholder-food.jpg'}
          alt={item.name}
          layout="fill"
          objectFit="cover"
        />
      </div>

      {/* Item Details */}
      <div className="flex-grow">
        <h4 className="text-lg font-semibold">{item.name}</h4>
        <p className="text-sm text-gray-600 capitalize">
          {/* Use the correct property: selectedPortion */}
          Portion: {item.selectedPortion}
        </p>
        <p className="text-sm text-gray-500">
          Unit Price: ${item.itemPrice.toFixed(2)}
        </p>
      </div>

      {/* Quantity Selector */}
      <div className="flex items-center mx-4">
        <button
          onClick={() => handleQuantityChange(item.quantity - 1)}
          className="bg-gray-200 text-gray-700 px-3 py-1 rounded-l-md"
        >
          -
        </button>
        <span className="px-4 py-1 border-t border-b">{item.quantity}</span>
        <button
          onClick={() => handleQuantityChange(item.quantity + 1)}
          className="bg-gray-200 text-gray-700 px-3 py-1 rounded-r-md"
        >
          +
        </button>
      </div>

      {/* Total Price & Remove Button */}
      <div className="text-right w-24">
        <p className="text-lg font-semibold">
          ${(item.itemPrice * item.quantity).toFixed(2)}
        </p>
        <button
          onClick={handleRemove}
          className="text-sm text-red-500 hover:underline"
        >
          Remove
        </button>
      </div>
    </div>
  );
}
