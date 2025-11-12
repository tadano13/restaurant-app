"use client";

import React, { useState, useEffect } from 'react';
import MenuCard from '@/components/customer/MenuCard'; // Import component
import { IMenuItem } from '@/types'; // Import type

// --- MOCK DATA ---
// We will replace this with a real API call
const MOCK_MENU_ITEMS: IMenuItem[] = [
  {
    _id: "1",
    restaurant_id: "r1",
    name: "Classic Burger",
    description: "A juicy beef patty with lettuce, tomato, and special sauce.",
    price: 10.99,
    category: "Mains",
    image_url: "/placeholder-food.jpg",
    portions: [
      { type: "Single", price_adjustment: 0 },
      { type: "Double", price_adjustment: 4 },
    ],
    is_available: true,
    dietary_tags: ["beef"],
  },
  {
    _id: "2",
    restaurant_id: "r1",
    name: "Caesar Salad",
    description: "Crisp romaine lettuce, parmesan, croutons, and Caesar dressing.",
    price: 8.50,
    category: "Appetizers",
    image_url: "/placeholder-food.jpg",
    portions: [
      { type: "Small", price_adjustment: 0 },
      { type: "Large", price_adjustment: 3 },
    ],
    is_available: true,
    dietary_tags: ["vegetarian"],
  },
  {
    _id: "3",
    restaurant_id: "r1",
    name: "Fries",
    description: "Crispy golden french fries.",
    price: 4.00,
    category: "Sides",
    image_url: "/placeholder-food.jpg",
    portions: [],
    is_available: true,
    dietary_tags: ["vegan", "gluten-free"],
  }
];
// --- END MOCK DATA ---

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<IMenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        // const restaurantId = "YOUR_RESTAURANT_ID"; // This needs to come from context or URL
        // const res = await fetch(`/api/menu/${restaurantId}`);
        // if (!res.ok) {
        //   throw new Error('Failed to fetch menu');
        // }
        // const data = await res.json();
        // setMenuItems(data);
        
        // Using mock data for now
        setMenuItems(MOCK_MENU_ITEMS);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMenu();
  }, []);

  if (loading) {
    return <div className="text-center p-10">Loading menu...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Our Menu</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.length > 0 ? (
          menuItems.map((item) => (
            <MenuCard key={item._id} item={item} />
          ))
        ) : (
          <p>No menu items found.</p>
        )}
      </div>
    </div>
  );
}