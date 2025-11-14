import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Table from '@/models/Table';
import TableBooking from '@/models/TableBooking';

interface IParams {
  restaurant_id: string;
  table_id: string;
}

// GET /api/tables/:restaurant_id/:table_id
export async function GET(request: NextRequest, { params }: { params: IParams }) {
  try {
    await connectDB();
    const { table_id, restaurant_id } = params;

    const table = await Table.findOne({
      _id: table_id,
      restaurant_id: restaurant_id,
    });

    if (!table) {
      return NextResponse.json({ message: 'Table not found' }, { status: 404 });
    }

    let currentBookingInfo = null;
    if (table.status === 'reserved' && table.current_booking_id) {
      currentBookingInfo = await TableBooking.findById(table.current_booking_id);
    }

    return NextResponse.json(
      {
        table_details: table,
        current_booking_info: currentBookingInfo, // As per plan
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('GET /api/tables/:id/:id error:', error);
    return NextResponse.json(
      { message: 'An internal server error occurred' },
      { status: 500 }
    );
  }
}
