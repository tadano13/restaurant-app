"use client";

import React, { useState, useEffect } from 'react';
// import { IRestaurant } from '@/types'; // We'll need this type

export default function SettingsPage() {
  // Placeholder state for restaurant settings
  const [settings, setSettings] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    currency: 'INR',
    total_tables: 0,
  });
  const [loading, setLoading] = useState(false);
  
  // In a real app, you would fetch the current restaurant's settings
  // useEffect(() => {
  //   const fetchSettings = async () => {
  //     setLoading(true);
  //     const res = await fetch(`/api/restaurant/${MOCK_RESTAURANT_ID}`);
  //     const data = await res.json();
  //     setSettings(data);
  //     setLoading(false);
  //   };
  //   fetchSettings();
  // }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // In a real app, you would call a PUT API to save settings
    console.log("Saving settings:", settings);
    setTimeout(() => {
      setLoading(false);
      alert('Settings saved (mock)!');
    }, 1000);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Restaurant Settings</h1>
      
      <form onSubmit={handleSave} className="bg-white p-6 rounded-lg shadow-md max-w-2xl">
        <div className="space-y-4">
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Restaurant Name</label>
            <input
              type="text"
              name="name"
              value={settings.name}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <input
              type="text"
              name="address"
              value={settings.address}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                name="phone"
                value={settings.phone}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={settings.email}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          
          {/* We would add more fields here for operating_hours, etc. */}

        </div>
        
        <div className="mt-6 pt-4 border-t">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}