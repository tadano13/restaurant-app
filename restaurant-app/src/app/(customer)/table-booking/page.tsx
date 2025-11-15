"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ITable } from '@/types';

const MOCK_RESTAURANT_ID = "60d0fe4f5311236168a109ca";

export default function TableBookingPage() {
  const router = useRouter();
  
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [guests, setGuests] = useState('2');
  const [availableTables, setAvailableTables] = useState<ITable[]>([]);
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      console.log('Booking confirmed! ID: ' + data.booking_id); // Use console.log
      router.push('/'); 
      
    } catch (err: any)
[Immersive content redacted for brevity.]
