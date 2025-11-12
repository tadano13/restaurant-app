import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import TableBooking from '@/models/TableBooking';
import Table from '@/models/Table';
import { verifyToken } from '@/lib/auth';

interface IParams {
  restaurant_id: string;
}

// POST /api/bookings/:restaurant_id (Plan has /api/bookings, but it needs restaurant context)
export async function POST(request: NextRequest, { params }: { params: IParams }) {
  try {
    await connectDB();
    const { restaurant_id } = params;
    const body = await request.json();

    const {
      table_id,
      customer_name,
      customer_email,
      customer_phone,
      number_of_guests,
      booking_date,
      booking_time,
    } = body;

    // TODO: Add logic here to check if the table is actually available
    // at the requested date/time before creating the booking.
    // This is a complex but crucial step.

    const newBooking = new TableBooking({
      ...body,
      restaurant_id,
    });

    await newBooking.save();

    // Optionally, update the table status
    await Table.findByIdAndUpdate(table_id, {
      status: 'reserved',
      current_booking_id: newBooking._id,
    });

    return NextResponse.json(
      {
        message: 'Booking confirmed',
        booking_id: newBooking._id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/bookings error:', error);
    return NextResponse.json(
      { message: 'An internal server error occurred' },
      { status: 500 }
    );
  }
}

// GET /api/bookings/:restaurant_id (Admin only)
export async function GET(request: NextRequest, { params }: { params: IParams }) {
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

    // 3. Fetch all bookings for the restaurant
    const bookings = await TableBooking.find({
      restaurant_id: params.restaurant_id,
    }).sort({ booking_date: -1 });

    return NextResponse.json(bookings, { status: 200 });
  } catch (error) {
    console.error('GET /api/bookings error:', error);
    return NextResponse.json(
      { message: 'An internal server error occurred' },
      { status: 500 }
    );
  }
}