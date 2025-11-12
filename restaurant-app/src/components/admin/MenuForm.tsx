"use client";

import React, { useState, useEffect } from 'react';
import { IMenuItem } from '@/types';

interface MenuFormProps {
  itemToEdit: IMenuItem | null;
  onSave: (formData: any) => void;
  onClose: () => void;
}

export default function MenuForm({ itemToEdit, onSave, onClose }: MenuFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    category: '',
    image_url: '',
    // We'll keep portion editing simple for now
  });

  useEffect(() => {
    if (itemToEdit) {
      setFormData({
        name: itemToEdit.name,
        description: itemToEdit.description,
        price: itemToEdit.price,
        category: itemToEdit.category,
        image_url: itemToEdit.image_url,
      });
    } else {
      // Reset form when adding new
      setFormData({
        name: '',
        description: '',
        price: 0,
        category: '',
        image_url: '',
      });
    }
  }, [itemToEdit]);

  // --- THIS IS THE CORRECTED LINE (added '=>') ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Image URL</label>
          <input
            type="text"
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        
        {/* TODO: Add portion management UI */}

        <div className="flex justify-end space-x-2 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Save Item
          </button>
        </div>
      </div>
    </form>
  );
}
