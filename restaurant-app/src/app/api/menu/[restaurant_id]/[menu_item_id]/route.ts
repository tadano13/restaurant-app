import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import MenuItem from '@/models/MenuItem';
import { verifyToken } from '@/lib/auth';

interface IParams {
  restaurant_id: string;
  menu_item_id: string;
}

// PUT /api/menu/:restaurant_id/:menu_item_id
export async function PUT(request: NextRequest, { params }: { params: IParams }) {
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
    const body = await request.json();
    const { menu_item_id } = params;

    // 3. Find and update the item
    const updatedItem = await MenuItem.findByIdAndUpdate(
      menu_item_id,
      body,
      { new: true } // Return the updated document
    );

    if (!updatedItem) {
      return NextResponse.json({ message: 'Menu item not found' }, { status: 404 });
    }
    
    // Ensure the item belongs to the correct restaurant
    if (updatedItem.restaurant_id.toString() !== params.restaurant_id) {
        return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json(updatedItem, { status: 200 });
  } catch (error) {
    console.error('PUT /api/menu/:id error:', error);
    return NextResponse.json(
      { message: 'An internal server error occurred' },
      { status: 500 }
    );
  }
}

// DELETE /api/menu/:restaurant_id/:menu_item_id
export async function DELETE(request: NextRequest, { params }: { params: IParams }) {
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
    const { menu_item_id } = params;

    // 3. Find and delete the item
    const deletedItem = await MenuItem.findByIdAndDelete(menu_item_id);

    if (!deletedItem) {
      return NextResponse.json({ message: 'Menu item not found' }, { status: 404 });
    }
    
    // Ensure the item belongs to the correct restaurant
    if (deletedItem.restaurant_id.toString() !== params.restaurant_id) {
        return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ message: 'Item deleted' }, { status: 200 });
  } catch (error) {
    console.error('DELETE /api/menu/:id error:', error);
    return NextResponse.json(
      { message: 'An internal server error occurred' },
      { status: 500 }
    );
  }
}