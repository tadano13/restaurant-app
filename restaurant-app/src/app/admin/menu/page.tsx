"use client";

import React, { useState, useEffect } from 'react';
import { IMenuItem } from '@/types';
import Modal from '@/components/common/Modal';
//
// THIS IS THE CORRECTED IMPORT PATH:
//
import MenuForm from '@/components/admin/MenuForm'; 
//
//
//
import Image from 'next/image';

// Placeholder restaurant ID
const MOCK_RESTAURANT_ID = "60d0fe4f5311236168a109ca"; 

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<IMenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for the modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<IMenuItem | null>(null);

  // Fetch all menu items
  const fetchMenu = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/menu/${MOCK_RESTAURANT_ID}`);
      if (!res.ok) throw new Error('Failed to fetch menu');
      const data = await res.json();
      setMenuItems(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  // Open modal for adding a new item
  const handleAddNew = () => {
    setItemToEdit(null);
    setIsModalOpen(true);
  };

  // Open modal for editing an existing item
  const handleEdit = (item: IMenuItem) => {
    setItemToEdit(item);
    setIsModalOpen(true);
  };

  // Handle delete
  const handleDelete = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    try {
      const res = await fetch(`/api/menu/${MOCK_RESTAURANT_ID}/${itemId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete item');
      
      // Remove from local state
      setMenuItems((prev) => prev.filter((item) => item._id !== itemId));
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  // Handle save (Create or Update)
  const handleSave = async (formData: any) => {
    try {
      let res;
      if (itemToEdit) {
        // Update (PUT)
        res = await fetch(`/api/menu/${MOCK_RESTAURANT_ID}/${itemToEdit._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      } else {
        // Create (POST)
        res = await fetch(`/api/menu/${MOCK_RESTAURANT_ID}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      }

      if (!res.ok) throw new Error('Failed to save item');
      
      // Close modal and refresh menu
      setIsModalOpen(false);
      fetchMenu(); 
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Menu Management</h1>
        <button
          onClick={handleAddNew}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          + Add New Item
        </button>
      </div>

      {loading && <p>Loading menu...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Image</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Available</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {menuItems.map((item) => (
                <tr key={item._id}>
                  <td className="px-6 py-4">
                    <Image
                      src={item.image_url || '/placeholder-food.jpg'}
                      alt={item.name}
                      width={50}
                      height={50}
                      className="rounded-md object-.cover"
                    />
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.category}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">${item.price.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {item.is_available ? 'Yes' : 'No'}
                  </td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={itemToEdit ? 'Edit Menu Item' : 'Add New Menu Item'}
      >
        <MenuForm
          itemToEdit={itemToEdit}
          onSave={handleSave}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
