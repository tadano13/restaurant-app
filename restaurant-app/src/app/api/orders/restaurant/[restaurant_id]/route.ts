import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import { verifyToken } from '@/lib/auth';

interface IParams {
  restaurant_id: string;
}

// GET /api/orders/restaurant/:restaurant_id
export async function GET(request: NextRequest, { params }: { params: IParams }) {
  try {
    // 1. Verify Authentication (Admin/Staff only)
    const user = await verifyToken(request);
    if (!user || (user.role !== 'admin' && user.role !== 'staff')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // 2. Check if restaurant_id in token matches URL
    if (user.restaurant_id !== params.restaurant_id) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    await connectDB();

    // 3. Fetch all orders, sorted by newest first
    const orders = await Order.find({
      restaurant_id: params.restaurant_id,
    })
      .populate('table_id', 'table_number') // Get table number
      .sort({ order_placed_at: -1 });

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error('GET /api/orders/restaurant/:id error:', error);
    return NextResponse.json(
      { message: 'An internal server error occurred' },
      { status: 500 }
    );
  }
}