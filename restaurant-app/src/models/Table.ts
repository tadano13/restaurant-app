import mongoose, { Schema, Document } from 'mongoose';

export interface ITable extends Document {
  restaurant_id: Schema.Types.ObjectId;
  table_number: number;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved' | 'maintenance';
  qr_code: string; // This will likely store a URL or unique ID
  current_booking_id?: Schema.Types.ObjectId;
  created_at: Date;
  updated_at: Date;
}

const TableSchema: Schema = new Schema(
  {
    restaurant_id: {
      type: Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
    },
    table_number: { type: Number, required: true },
    capacity: { type: Number, required: true },
    status: {
      type: String,
      enum: ['available', 'occupied', 'reserved', 'maintenance'],
      default: 'available',
    },
    qr_code: { type: String, unique: true }, //
    current_booking_id: { type: Schema.Types.ObjectId, ref: 'TableBooking' }, //
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

// Compound index to ensure table numbers are unique per restaurant
TableSchema.index({ restaurant_id: 1, table_number: 1 }, { unique: true });

export default mongoose.models.Table ||
  mongoose.model<ITable>('Table', TableSchema);