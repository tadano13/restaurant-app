"use client";

import React, { useState, useEffect } from 'react';
import { ITable } from '@/types';

// Placeholder restaurant ID
const MOCK_RESTAURANT_ID = "60d0fe4f5311236168a109ca";

export default function TablesPage() {
  const [tables, setTables] = useState<ITable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all tables
  const fetchTables = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/tables/${MOCK_RESTAURANT_ID}`);
      if (!res.ok) {
        throw new Error('Failed to fetch tables');
      }
      const data = await res.json();
      setTables(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  // Helper function for styling table status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-500';
      case 'occupied':
        return 'bg-red-500';
      case 'reserved':
        return 'bg-blue-500';
      case 'maintenance':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-400';
    }
  };

  // TODO: Add a modal/form to create a new table
  // TODO: Add a way to update a table's status

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Table Management</h1>
        <button
          // onClick={handleAddNewTable}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          + Add New Table
        </button>
      </div>

      {loading && <p>Loading tables...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {tables
            .sort((a, b) => a.table_number - b.table_number) // Sort tables by number
            .map((table) => (
              <div
                key={table._id}
                className="bg-white p-4 rounded-lg shadow-md border-t-4"
                style={{ borderTopColor: getStatusColor(table.status).replace('bg-', '').split('-')[0] }}
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold">
                    Table {table.table_number}
                  </h3>
                  <span
                    className={`px-2 py-1 text-xs font-semibold text-white rounded-full ${getStatusColor(
                      table.status
                    )}`}
                  >
                    {table.status}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mt-2">
                  Capacity: {table.capacity} guests
                </p>
                {/* We can add more details, like current order or booking */}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}