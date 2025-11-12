"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ITable } from '@/types';

// Placeholder restaurant ID
const MOCK_RESTAURANT_ID = "60d0fe4f5311236168a109ca";

export default function TableBookingPage() {
  const router = useRouter();
  
  // Form state
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [guests, setGuests] = useState('2');
  
  // Step 2: Show available tables
  const [availableTables, setAvailableTables] = useState<ITable[]>([]);
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  
  // Customer details
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1: Check Availability
  const handleCheckAvailability = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setAvailableTables([]);
    
    try {
      const res = await fetch(
        `/api/tables/${MOCK_RESTAURANT_ID}/availability?date=${date}&time=${time}&guests=${guests}`
      );
      if (!res.ok) {
        throw new Error('Failed to check availability');
      }
      const data = await res.json();
      if (data.length === 0) {
        setError('No tables available for the selected time and party size.');
      } else {
        setAvailableTables(data);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Handle Final Booking Submission
  const handleBookTable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTableId || !customerName || !customerPhone || !customerEmail) {
      setError('Please fill in all details and select a table.');
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      const payload = {
        table_id: selectedTableId,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        number_of_guests: parseInt(guests, 10),
        booking_date: new Date(`${date}T${time}:00`),
        booking_time: time,
      };

      const res = await fetch(`/api/bookings/${MOCK_RESTAURANT_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('Failed to create booking.');
      }

      const data = await res.json();
      alert('Booking confirmed! Your booking ID is ' + data.booking_id);
      router.push('/'); // Redirect to home
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-lg">
      <h1 className="text-3xl font-bold text-center mb-8">Book a Table</h1>
      
      {/* Step 1: Availability Form */}
      <form onSubmit={handleCheckAvailability} className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4">Find a Table</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Time</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Guests</label>
          <select
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            {[...Array(8)].map((_, i) => (
              <option key={i + 1} value={i + 1}>{i + 1} Guest{i > 0 ? 's' : ''}</option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Checking...' : 'Check Availability'}
        </button>
      </form>

      {/* Step 2: Booking Form */}
      {availableTables.length > 0 && (
        <form onSubmit={handleBookTable} className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Confirm Your Details</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Select Table</label>
            <p className="text-xs text-gray-500 mb-2">These tables fit your party size. We've selected one for you.</p>
            {/* Simple auto-selection of the first available table */}
            <input
              type="text"
              value={`Table ${availableTables[0].table_number} (Capacity: ${availableTables[0].capacity})`}
              onFocus={() => setSelectedTableId(availableTables[0]._id)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
              readOnly
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="tel"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white font-semibold py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
          >
            {loading ? 'Booking...' : 'Confirm Booking'}
          </button>
        </form>
      )}

      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
    </div>
  );
}