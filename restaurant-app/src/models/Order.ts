import mongoose, { Schema, Document } from 'mongoose';

interface IOrderItem {
  menu_item_id: Schema.Types.ObjectId;
  quantity: number;
  portion: string; // e.g., 'small'
  special_instructions: string;
  price: number; // The price for this item (quantity * (base_price + adjustment))
}

export interface IOrder extends Document {
  restaurant_id: Schema.Types.ObjectId;
  table_id: Schema.Types.ObjectId;
  customer_email?: string;
  items: IOrderItem[];
  total_amount: number;
  status:
    | 'pending'
    | 'confirmed'
    | 'preparing'
    | 'ready'
    | 'served'
    | 'cancelled';
  payment_status: 'unpaid' | 'paid' | 'partial';
  payment_method?: 'cash' | 'online' | 'card';
  payment_id?: string;
  order_placed_at: Date;
  estimated_ready_time?: Date;
  served_at?: Date;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

const OrderItemSchema: Schema = new Schema({
  menu_item_id: {
    type: Schema.Types.ObjectId,
    ref: 'MenuItem',
    required: true,
  },
  quantity: { type: Number, required: true, min: 1 },
  portion: { type: String },
  special_instructions: { type: String },
  price: { type: Number, required: true }, // Price at the time of order
});

const OrderSchema: Schema = new Schema(
  {
    restaurant_id: {
      type: Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
    },
    table_id: { type: Schema.Types.ObjectId, ref: 'Table', required: true },
    customer_email: { type: String },
    items: { type: [OrderItemSchema], required: true },
    total_amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'preparing', 'ready', 'served', 'cancelled'],
      default: 'pending',
    },
    payment_status: {
      type: String,
      enum: ['unpaid', 'paid', 'partial'],
      default: 'unpaid',
    },
    payment_method: { type: String, enum: ['cash', 'online', 'card'] },
    payment_id: { type: String }, // From Razorpay/Stripe
    order_placed_at: { type: Date, default: Date.now },
    estimated_ready_time: { type: Date },
    served_at: { type: Date },
    notes: { type: String },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

OrderSchema.index({ restaurant_id: 1, status: 1 });
OrderSchema.index({ restaurant_id: 1, order_placed_at: -1 });

export default mongoose.models.Order ||
  mongoose.model<IOrder>('Order', OrderSchema);