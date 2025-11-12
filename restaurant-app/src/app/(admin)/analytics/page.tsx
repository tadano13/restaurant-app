"use client";

import React from 'react';
// In a real app, you would install and import a chart library
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

// Placeholder data
const placeholderRevenueData = [
  { name: 'Mon', revenue: 4000 },
  { name: 'Tue', revenue: 3000 },
  { name: 'Wed', revenue: 2000 },
  { name: 'Thu', revenue: 2780 },
  { name: 'Fri', revenue: 1890 },
  { name: 'Sat', revenue: 2390 },
  { name: 'Sun', revenue: 3490 },
];

const placeholderPopularItems = [
  { name: 'Classic Burger', orders: 150 },
  { name: 'Caesar Salad', orders: 90 },
  { name: 'Fries', orders: 200 },
];

export default function AnalyticsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Analytics</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Revenue Chart Placeholder */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Revenue This Week</h2>
          <div className="h-64 bg-gray-100 flex items-center justify-center rounded-md">
            <p className="text-gray-500">[Revenue Bar Chart Placeholder]</p>
          </div>
          {/* // Real Recharts implementation would look like this:
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={placeholderRevenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
          */}
        </div>

        {/* Popular Items Placeholder */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Most Popular Items</h2>
          <ul className="space-y-2">
            {placeholderPopularItems.map((item) => (
              <li key={item.name} className="flex justify-between p-2 bg-gray-50 rounded-md">
                <span className="font-medium">{item.name}</span>
                <span className="font-bold">{item.orders} orders</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Other Stats */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Key Metrics</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Average Order Value</span>
              <span className="font-bold">$0.00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Orders Today</span>
              <span className="font-bold">0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">New Customers</span>
              <span className="font-bold">0</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}