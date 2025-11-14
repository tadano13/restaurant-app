"use client";

import React from 'react';
import { CartProvider } from '@/context/CartContext';
import CartIcon from '@/components/customer/CartIcon'; // 1. Import the new component
import Link from 'next/link';

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-md sticky top-0 z-50">
          <nav className="container mx-auto p-4 flex justify-between items-center">
            {/* Make the restaurant name a link back to the menu */}
            <Link href="/menu">
              <span className="text-xl font-bold cursor-pointer hover:text-blue-600">
                My Restaurant
              </span>
            </Link>
            
            {/* 2. Replace the placeholder text with the component */}
            <CartIcon />
            
          </nav>
        </header>

        <main>{children}</main>
      </div>
    </CartProvider>
  );
}
