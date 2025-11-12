import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
  restaurant_id: Schema.Types.ObjectId;
  order_id: Schema.Types.ObjectId;
  amount: number;
  currency: string;
  payment_method: string;
  gateway_transaction_id: string; // From Razorpay/Stripe
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  timestamp: Date;
  created_at: Date;
  updated_at: Date;
}

const PaymentSchema: Schema = new Schema(
  {
    restaurant_id: {
      type: Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
    },
    order_id: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true, default: 'INR' },
    payment_method: { type: String, required: true }, // e.g., 'razorpay', 'stripe', 'cash'
    gateway_transaction_id: { type: String, index: true },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    timestamp: { type: Date, default: Date.now },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

export default mongoose.models.Payment ||
  mongoose.model<IPayment>('Payment', PaymentSchema);