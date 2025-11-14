import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Table from '@/models/Table';
import TableBooking from '@/models/TableBooking';
import { ITable } from '@/types';

interface IParams {
  restaurant_id: string;
}

// GET /api/tables/:restaurant_id/availability?date=...&time=...&guests=...
export async function GET(request: NextRequest, { params }: { params: IParams }) {
  try {
    await connectDB();
    const { restaurant_id } = params;
    const { searchParams } = request.nextUrl;

    const date = searchParams.get('date'); // e.g., "2025-12-31"
    const time = searchParams.get('time'); // e.g., "19:30"
    const guests = searchParams.get('guests'); // e.g., "4"

    if (!date || !time || !guests) {
      return NextResponse.json(
        { message: 'Date, time, and guests are required' },
        { status: 400 }
      );
    }

    const bookingDate = new Date(`${date}T${time}:00`);

    // 1. Find all tables that meet the guest capacity
    // --- FIX 1: Cast the result of .lean() to our type ---
    const allTables = (await Table.find({
      restaurant_id,
      capacity: { $gte: parseInt(guests, 10) },
    }).lean()) as ITable[]; // <-- This tells TS what the type is

    // 2. Find all *conflicting* bookings for those tables on that date
    // Now this line will work, since TS knows `t` is an ITable
    const tableIds = allTables.map((t) => t._id);

    // Find bookings that overlap with the requested time
    // This simple logic just checks for the same date and time slot
    const conflictingBookings = await TableBooking.find({
      table_id: { $in: tableIds },
      booking_date: bookingDate,
      booking_time: time,
      status: 'confirmed', // Only check confirmed bookings
    }).select('table_id');

    // --- FIX 2: Corrected the typo (b) to (b) => ---
    const bookedTableIds = new Set(
      conflictingBookings.map((b) => b.table_id.toString())
    );

    // 3. Filter out tables that are already booked
    // This line will also work now
    const availableTables = allTables.filter(
      (table) => !bookedTableIds.has(table._id.toString())
    );

    return NextResponse.json(availableTables, { status: 200 });
  } catch (error) {
    console.error('GET /api/tables/availability error:', error);
    return NextResponse.json(
      { message: 'An internal server error occurred' },
      { status: 500 }
    );
  }
}
