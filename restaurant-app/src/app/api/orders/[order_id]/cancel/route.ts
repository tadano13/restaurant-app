import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import { verifyToken } from '@/lib/auth';

interface IParams {
  order_id: string;
}

// PUT /api/orders/:order_id/cancel
export async function PUT(request: NextRequest, { params }: { params: IParams }) {
  try {
    // 1. Verify Authentication (Customer or Admin)
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    await connectDB();
    const { order_id } = params;
    const { reason } = await request.json();

    const order = await Order.findById(order_id);

    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    // 2. Authorization: Allow if admin of that restaurant
    if (user.role === 'admin' && user.restaurant_id !== order.restaurant_id.toString()) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }
    // TODO: Add auth check if it's the customer who placed it

    // 3. Logic: Only allow cancellation if order is 'pending'
    if (order.status !== 'pending') {
      return NextResponse.json(
        { message: `Cannot cancel order with status: ${order.status}` },
        { status: 409 } // Conflict
      );
    }
    
    // 4. Update order status
    order.status = 'cancelled';
    order.notes = reason || 'Order cancelled by user';
    await order.save();
    
    // TODO: Handle refund logic if payment was already made
    let refund_status = 'N/A';
    if(order.payment_status === 'paid') {
        // refund_status = await handleRefund(order.payment_id);
        refund_status = 'pending_refund'; // Placeholder
    }

    return NextResponse.json(
      { message: 'Order cancelled', refund_status },
      { status: 200 }
    );
  } catch (error) {
    console.error('PUT /api/orders/:id/cancel error:', error);
    return NextResponse.json(
      { message: 'An internal server error occurred' },
      { status: 500 }
    );
  }
}