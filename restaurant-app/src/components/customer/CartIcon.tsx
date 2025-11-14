"use client";

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

// Simple SVG for a shopping bag icon
const BagIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
    />
  </svg>
);

export default function CartIcon() {
  const { cartCount } = useCart();

  return (
    <Link href="/cart">
      <span className="relative flex items-center p-2 text-gray-700 hover:text-blue-600 transition-colors cursor-pointer">
        <BagIcon />
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
            {cartCount}
          </span>
        )}
      </span>
    </Link>
  );
}
