import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import { verifyToken } from '@/lib/auth';
import { socket } from '@/lib/socket'; // Import the socket client

// GET /api/orders/:order_id
// --- FIX 1: Replaced IParams with inline type ---
export async function GET(
  request: NextRequest,
  { params }: { params: { order_id: string } }
) {
  try {
    await connectDB();
    const { order_id } = params;

    const order = await Order.findById(order_id)
      .populate('table_id', 'table_number')
      .populate('items.menu_item_id', 'name image_url');

    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    // TODO: Add auth check if this is for a customer
    // or an admin

    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    console.error('GET /api/orders/:id error:', error);
    return NextResponse.json(
      { message: 'An internal server error occurred' },
      { status: 500 }
    );
  }
}

// PUT /api/orders/:order_id (Update Status)
// --- FIX 2: Replaced IParams with inline type ---
export async function PUT(
  request: NextRequest,
  { params }: { params: { order_id: string } }
) {
  try {
    // 1. Verify Authentication (Admin/Staff only)
    const user = await verifyToken(request);
    if (!user || (user.role !== 'admin' && user.role !== 'staff')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { order_id } = params;
    const { status } = await request.json(); // "confirmed", "preparing", "ready", "served"

    if (!status) {
      return NextResponse.json({ message: 'Status is required' }, { status: 400 });
    }

    // 2. Find and update the order
    const updatedOrder = await Order.findByIdAndUpdate(
      order_id,
      { status },
      { new: true } // Return the new, updated document
    );

    if (!updatedOrder) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    // 3. Ensure user is updating an order for their own restaurant
    if (user.restaurant_id !== updatedOrder.restaurant_id.toString()) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    // --- REAL-TIME UPDATE ---
    // 4. Connect, emit the event, and disconnect
    // This is a simple fire-and-forget emit
    try {
      socket.connect();
      socket.emit('order:status-update', {
        orderId: updatedOrder._id.toString(),
        status: updatedOrder.status,
      });
      socket.disconnect();
    } catch (socketError) {
      console.error('Socket.io emit error:', socketError);
      // Do not fail the API request if the socket fails
    }
    // --- END REAL-TIME ---

    // 5. Return the successful API response
    return NextResponse.json(updatedOrder, { status: 200 });
  } catch (error) {
    console.error('PUT /api/orders/:id error:', error);
    return NextResponse.json(
      { message: 'An internal server error occurred' },
      { status: 500 }
    );
  }
}
