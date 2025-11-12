import React from 'react';
import { CartProvider } from '@/context/CartContext';
// We'll create this component later
// import CartIcon from '@/components/customer/CartIcon';

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider> {/* Wrap the layout with the CartProvider */}
      <div className="min-h-screen bg-gray-50">
        
        {/* We can add a customer-specific header or nav bar here */}
        <header className="bg-white shadow-md sticky top-0 z-50">
          <nav className="container mx-auto p-4 flex justify-between items-center">
            <h1 className="text-xl font-bold">My Restaurant</h1>
            {/* <CartIcon /> We'll add this later */}
            <div className="text-blue-600">Cart (placeholder)</div>
          </nav>
        </header>

        <main>{children}</main>
        
      </div>
    </CartProvider>
  );
}