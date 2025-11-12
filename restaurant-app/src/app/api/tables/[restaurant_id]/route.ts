import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Table from '@/models/Table';

interface IParams {
  restaurant_id: string;
}

// GET /api/tables/:restaurant_id
export async function GET(request: NextRequest, { params }: { params: IParams }) {
  try {
    await connectDB();
    const { restaurant_id } = params;

    const tables = await Table.find({ restaurant_id });

    if (!tables) {
      return NextResponse.json({ message: 'Tables not found' }, { status: 404 });
    }

    return NextResponse.json(tables, { status: 200 }); //
  } catch (error) {
    console.error('GET /api/tables/:id error:', error);
    return NextResponse.json(
      { message: 'An internal server error occurred' },
      { status: 500 }
    );
  }
}