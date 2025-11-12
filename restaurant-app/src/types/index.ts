// Based on the Mongoose models in Section 4.1

export interface IPortion {
  type: string; // e.g., 'small', 'medium', 'large'
  price_adjustment: number;
}

export interface IMenuItem {
  _id: string; // MongoDB IDs are strings on the frontend
  restaurant_id: string;
  name: string;
  description: string;
  price: number; // Base price
  category: string;
  image_url: string;
  portions: IPortion[];
  is_available: boolean;
  dietary_tags: string[];
}

// We can add other types here as we build
export interface ICartItem {
  menu_item_id: string;
  name: string;
  quantity: number;
  portion: string; // e.g., 'small'
  special_instructions: string;
  price: number; // The calculated price for this cart item
}

export interface IOrderItem {
  menu_item_id: string;
  name: string; // We'll populate this
  quantity: number;
  portion: string;
  special_instructions: string;
  price: number;
}

export interface IOrder {
  _id: string;
  restaurant_id: string;
  table_id: { // This will be populated
    _id: string;
    table_number: number;
  };
  items: IOrderItem[];
  total_amount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'served' | 'cancelled';
  payment_status: 'unpaid' | 'paid' | 'partial';
  payment_method?: 'cash' | 'online' | 'card';
  order_placed_at: string; // Dates are strings in JSON
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ITableBooking {
  _id: string;
  restaurant_id: string;
  table_id: { // Assuming this will be populated
    _id: string;
    table_number: number;
  };
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  number_of_guests: number;
  booking_date: string; // Dates are strings in JSON
  booking_time: string; // e.g., '19:30'
  status: 'confirmed' | 'cancelled' | 'completed' | 'no-show';
  special_requests?: string;
  created_at: string;
}

export interface ITable {
  _id: string;
  restaurant_id: string;
  table_number: number;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved' | 'maintenance';
  qr_code: string;
  current_booking_id?: string;
}