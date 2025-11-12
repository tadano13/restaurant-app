"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ICartItem, IMenuItem } from '@/types';

// Define the shape of the cart item
interface CartItem extends IMenuItem {
  quantity: number;
  selectedPortion: string;
  itemPrice: number; // Price for one item with portion
}

// Define the shape of the context
interface ICartContext {
  cartItems: CartItem[];
  addToCart: (item: IMenuItem, quantity: number, selectedPortion: { type: string, price_adjustment: number }) => void;
  removeFromCart: (itemId: string, portion: string) => void;
  updateQuantity: (itemId: string, portion: string, newQuantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  totalPrice: number;
}

// Create the context
const CartContext = createContext<ICartContext | undefined>(undefined);

// Create the provider component
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (item: IMenuItem, quantity: number, selectedPortion: { type: string, price_adjustment: number }) => {
    setCartItems((prevItems) => {
      // Check if item with the same ID and portion already exists
      const existingItemIndex = prevItems.findIndex(
        (i) => i._id === item._id && i.selectedPortion === selectedPortion.type
      );

      const itemPrice = item.price + selectedPortion.price_adjustment;

      if (existingItemIndex > -1) {
        // Update quantity
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        return updatedItems;
      } else {
        // Add new item
        const newItem: CartItem = {
          ...item,
          quantity,
          selectedPortion: selectedPortion.type,
          itemPrice: itemPrice,
        };
        return [...prevItems, newItem];
      }
    });
  };

  const removeFromCart = (itemId: string, portion: string) => {
    setCartItems((prevItems) =>
      prevItems.filter(
        (item) => !(item._id === itemId && item.selectedPortion === portion)
      )
    );
  };

  const updateQuantity = (itemId: string, portion: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId, portion);
    } else {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item._id === itemId && item.selectedPortion === portion
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Calculate cart count and total price
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.itemPrice * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Create a custom hook to use the context easily
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};