"use client";

import React, { useState } from 'react';
import { IMenuItem } from '@/types';
import { useCart } from '@/context/CartContext'; // Import the hook
import Image from 'next/image';

interface MenuCardProps {
  item: IMenuItem;
}

export default function MenuCard({ item }: MenuCardProps) {
  const { addToCart } = useCart(); // Use the context hook
  
  const defaultPortion = item.portions.length > 0 ? item.portions[0] : { type: 'default', price_adjustment: 0 };
  
  const [selectedPortion, setSelectedPortion] = useState(defaultPortion);
  const [quantity, setQuantity] = useState(1);

  // Calculate the final price based on base price + portion adjustment
  const calculatePrice = () => {
    return item.price + (selectedPortion.price_adjustment || 0);
  };

  const currentPrice = calculatePrice();

  const handleAddToCart = () => {
    // Pass the full item, quantity, and selected portion object
    addToCart(item, quantity, selectedPortion);
    alert(`${quantity} x ${item.name} (${selectedPortion.type}) added to cart!`);
  };

  return (
    <div className="border rounded-lg overflow-hidden shadow-md bg-white flex flex-col">
      {/* Image */}
      <div className="relative w-full h-48">
        <Image
          src={item.image_url || '/placeholder-food.jpg'} // Use a placeholder
          alt={item.name}
          layout="fill"
          objectFit="cover"
        />
      </div>

      <div className="p-4 flex flex-col flex-grow">
        {/* Item Name */}
        <h3 className="text-xl font-semibold mb-1">{item.name}</h3>
        
        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 flex-grow">{item.description}</p>

        {/* Portion Selection */}
        {item.portions.length > 0 && (
          <div className="mb-4">
            <span className="text-sm font-medium text-gray-700">Portion:</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {item.portions.map((portion) => (
                <button
                  key={portion.type}
                  onClick={() => setSelectedPortion(portion)}
                  className={`px-3 py-1 text-sm rounded-full border ${
                    selectedPortion.type === portion.type
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-gray-100 text-gray-700 border-gray-300'
                  }`}
                >
                  {portion.type} ({portion.price_adjustment >= 0 ? '+' : ''}
                  {portion.price_adjustment.toFixed(2)})
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Price and Quantity */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-xl font-bold text-gray-900">
            ${currentPrice.toFixed(2)}
          </span>
          <div className="flex items-center">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="bg-gray-200 text-gray-700 px-3 py-1 rounded-l-md"
            >
              -
            </button>
            <span className="px-4 py-1 border-t border-b">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="bg-gray-200 text-gray-700 px-3 py-1 rounded-r-md"
            >
              +
            </button>
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}