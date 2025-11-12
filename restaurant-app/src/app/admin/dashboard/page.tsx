import React from 'react';

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      {/* Placeholder for stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-600 text-sm font-medium">Today's Revenue</h3>
          <p className="text-3xl font-bold mt-2">$0.00</p>
          <p className="text-green-500 text-sm mt-1">+0%</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-600 text-sm font-medium">Today's Orders</h3>
          <p className="text-3xl font-bold mt-2">0</p>
          <p className="text-gray-500 text-sm mt-1">Pending: 0</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-600 text-sm font-medium">Tables Occupied</h3>
          <p className="text-3xl font-bold mt-2">0 / 15</p>
          <p className="text-gray-500 text-sm mt-1">0% capacity</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-600 text-sm font-medium">New Bookings</h3>
          <p className="text-3xl font-bold mt-2">0</p>
          <p className="text-gray-500 text-sm mt-1">Today</p>
        </div>
      </div>

      {/* Placeholder for main content blocks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
          <p className="text-gray-500">Recent orders list will appear here...</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Table Status</h2>
          <p className="text-gray-500">Live table status will appear here...</p>
        </div>
      </div>
    </div>
  );
}