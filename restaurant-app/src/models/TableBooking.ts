import mongoose, { Schema, Document } from 'mongoose';

export interface ITableBooking extends Document {
  restaurant_id: Schema.Types.ObjectId;
  table_id: Schema.Types.ObjectId;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  number_of_guests: number;
  booking_date: Date; // Store as a full Date object
  booking_time: string; // e.g., '19:30'
  duration_minutes: number;
  status: 'confirmed' | 'cancelled' | 'completed' | 'no-show';
  special_requests?: string;
  created_at: Date;
  updated_at: Date;
}

const TableBookingSchema: Schema = new Schema(
  {
    restaurant_id: {
      type: Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
    },
    table_id: { type: Schema.Types.ObjectId, ref: 'Table', required: true },
    customer_name: { type: String, required: true },
    customer_email: { type: String, required: true },
    customer_phone: { type: String, required: true },
    number_of_guests: { type: Number, required: true },
    booking_date: { type: Date, required: true },
    booking_time: { type: String, required: true }, // e.g., '19:30'
    duration_minutes: { type: Number, default: 90 },
    status: {
      type: String,
      enum: ['confirmed', 'cancelled', 'completed', 'no-show'],
      default: 'confirmed',
    },
    special_requests: { type: String },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

// Index for querying bookings by date
TableBookingSchema.index({ restaurant_id: 1, booking_date: 1 });

export default mongoose.models.TableBooking ||
  mongoose.model<ITableBooking>('TableBooking', TableBookingSchema);