import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import Table from '@/models/Table';
import MenuItem from '@/models/MenuItem';
import { IPortion } from '@/types'; // <-- 1. IMPORT THE TYPE

// POST /api/orders
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { table_id, items } = body;

    if (!table_id || !items || items.length === 0) {
      return NextResponse.json(
        { message: 'Table ID and items are required' },
        { status: 400 }
      );
    }

    // 1. Find the table and its restaurant
    const table = await Table.findById(table_id);
    if (!table) {
      return NextResponse.json({ message: 'Table not found' }, { status: 404 });
    }
    const { restaurant_id } = table;

    // 2. Get item IDs to fetch prices from DB
    const itemIds = items.map((item: any) => item.menu_item_id);
    const menuItems = await MenuItem.find({ _id: { $in: itemIds } });

    const menuItemMap = new Map(
      menuItems.map((item) => [item._id.toString(), item])
    );

    let total_amount = 0;
    const processedItems = [];

    // 3. Calculate total_amount on the server
    for (const item of items) {
      const dbItem = menuItemMap.get(item.menu_item_id);
      if (!dbItem) {
        return NextResponse.json(
          { message: `Item ${item.menu_item_id} not found` },
          { status: 404 }
        );
      }

      let itemPrice = dbItem.price;
      // Find price adjustment for selected portion
      if (item.portion) {
        // --- 2. THIS IS THE FIX ---
        const portion = dbItem.portions.find(
          (p: IPortion) => p.type === item.portion
        );
        // --- END OF FIX ---

        if (portion) {
          itemPrice += portion.price_adjustment;
        }
      }

      const price = itemPrice * item.quantity;
      total_amount += price;

      processedItems.push({
        ...item,
        price, // Use the server-calculated price
      });
    }

    // 4. Create the new order
    const newOrder = new Order({
      ...body,
      items: processedItems,
      total_amount,
      restaurant_id,
      order_placed_at: new Date(),
      status: 'pending',
      payment_status: 'unpaid',
    });

    await newOrder.save();

    // 5. Update table status
    await Table.findByIdAndUpdate(table_id, { status: 'occupied' });

    // TODO: Emit a socket.io event 'order:new' here

    return NextResponse.json(
      {
        message: 'Order placed successfully',
        order_id: newOrder._id,
        total_amount: newOrder.total_amount,
        status: newOrder.status,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/orders error:', error);
    return NextResponse.json(
      { message: 'An internal server error occurred' },
      { status: 500 }
    );
  }
}
