"use client";

import React, { useState, useEffect } from 'react';
import { ITableBooking } from '@/types';

const MOCK_RESTAURANT_ID = "60d0fe4f5311236168a109ca";

export default function BookingsPage() {
  const [bookings, setBookings] = useState<ITableBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/bookings/${MOCK_RESTAURANT_ID}`);
      if (!res.ok) {
        throw new Error('Failed to fetch bookings');
      }
      const data = await res.json();
      setBookings(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/bookings/${MOCK_RESTAURANT_ID}/${bookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        throw new Error('Failed to update booking status');
      }

      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking._id === bookingId
            ? { ...booking, status: newStatus as ITableBooking['status'] }
            : booking
        )
      );
    } catch (err: any) {
      console.error('Booking update error:', err.message);
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-primary-100 text-primary-800'; // Updated color
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'no-show': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100';
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Bookings</h1>

      {loading && <p>Loading bookings...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Table</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Guests</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Manage</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings.map((booking) => (
                <tr key={booking._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="font-medium text-gray-900">{booking.customer_name}</div>
                    <div className="text-gray-500">{booking.customer_phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>{new Date(booking.booking_date).toLocaleDateString()}</div>
                    <div className="font-medium">{booking.booking_time}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {booking.table_id?.table_number || 'N/A'}
                  </td>
                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {booking.number_of_guests}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <select
                      value={booking.status}
                      onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500" // Updated color
                    >
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="no-show">No-Show</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
