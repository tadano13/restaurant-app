"use client";

import React, { useState } from 'react';
import { IMenuItem } from '@/types';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';

interface MenuCardProps {
  item: IMenuItem;
}

export default function MenuCard({ item }: MenuCardProps) {
  const { addToCart } = useCart();
  
  const defaultPortion = item.portions.length > 0 ? item.portions[0] : { type: 'default', price_adjustment: 0 };
  
  const [selectedPortion, setSelectedPortion] = useState(defaultPortion);
  const [quantity, setQuantity] = useState(1);

  const calculatePrice = () => {
    return item.price + (selectedPortion.price_adjustment || 0);
  };

  const currentPrice = calculatePrice();

  const handleAddToCart = () => {
    addToCart(item, quantity, selectedPortion);
    // Using console.log instead of alert
    console.log(`${quantity} x ${item.name} (${selectedPortion.type}) added to cart!`);
  };

  return (
    <div className="border rounded-lg overflow-hidden shadow-md bg-white flex flex-col">
      <div className="relative w-full h-48">
        <Image
          src={item.image_url || '/placeholder-food.jpg'}
          alt={item.name}
          layout="fill"
          objectFit="cover"
        />
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold mb-1">{item.name}</h3>
        <p className="text-gray-600 text-sm mb-4 flex-grow">{item.description}</p>

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
                      ? 'bg-primary-600 text-white border-primary-600' // Updated color
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

        <button
          onClick={handleAddToCart}
          className="w-full bg-primary-600 text-white font-semibold py-2 rounded-lg hover:bg-primary-700 transition-colors" // Updated color
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
