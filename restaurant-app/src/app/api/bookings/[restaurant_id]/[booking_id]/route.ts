"use client";

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import TableBooking from '@/models/TableBooking';
import Table from '@/models/Table';
import { verifyToken } from '@/lib/auth';

// --- THIS IS THE CORRECTED FUNCTION SIGNATURE ---
// We removed the separate IParams interface and typed it inline.
export async function PUT(
  request: NextRequest,
  { params }: { params: { restaurant_id: string; booking_id: string } }
) {
  try {
    // 1. Verify Authentication (Admin only)
    const user = await verifyToken(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // 2. Check if restaurant_id in token matches URL
    if (user.restaurant_id !== params.restaurant_id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    await connectDB();
    const { booking_id } = params;
    const { status } = await request.json(); // e.g., "cancelled", "completed"

    if (!status) {
      return NextResponse.json(
        { message: 'Status is required' },
        { status: 400 }
      );
    }

    // 3. Find and update the booking
    const updatedBooking = await TableBooking.findByIdAndUpdate(
      booking_id,
      { status },
      { new: true }
    );

    if (!updatedBooking) {
      return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
    }

    // 4. If booking is cancelled or completed, free up the table
    if (status === 'cancelled' || status === 'completed') {
      await Table.findByIdAndUpdate(updatedBooking.table_id, {
        status: 'available',
        current_booking_id: null,
      });
    }

    return NextResponse.json(updatedBooking, { status: 200 });
  } catch (error) {
    console.error('PUT /api/bookings/:id error:', error);
    return NextResponse.json(
      { message: 'An internal server error occurred' },
      { status: 500 }
    );
  }
}
