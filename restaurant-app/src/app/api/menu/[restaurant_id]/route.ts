import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import MenuItem from '@/models/MenuItem';
import { verifyToken } from '@/lib/auth';

interface IParams {
  restaurant_id: string;
}

// GET /api/menu/:restaurant_id
// GET /api/menu/:restaurant_id?category=...
export async function GET(request: NextRequest, { params }: { params: IParams }) {
  try {
    await connectDB();
    const { restaurant_id } = params;
    const { searchParams } = request.nextUrl;
    const category = searchParams.get('category');

    // Build the query
    const query: { restaurant_id: string; category?: string } = {
      restaurant_id,
    };
    if (category) {
      query.category = category;
    }

    const menuItems = await MenuItem.find(query);

    return NextResponse.json(menuItems, { status: 200 });
  } catch (error) {
    console.error('GET /api/menu error:', error);
    return NextResponse.json(
      { message: 'An internal server error occurred' },
      { status: 500 }
    );
  }
}

// POST /api/menu/:restaurant_id
export async function POST(request: NextRequest, { params }: { params: IParams }) {
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

    // 3. Create new menu item
    const newMenuItem = new MenuItem({
      ...body,
      restaurant_id: params.restaurant_id, // Ensure it's set from the URL
    });

    await newMenuItem.save();

    return NextResponse.json(newMenuItem, { status: 201 });
  } catch (error) {
    console.error('POST /api/menu error:', error);
    return NextResponse.json(
      { message: 'An internal server error occurred' },
      { status: 500 }
    );
  }
}