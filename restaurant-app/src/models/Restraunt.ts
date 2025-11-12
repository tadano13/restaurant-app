import mongoose, { Schema, Document } from 'mongoose';

export interface IRestaurant extends Document {
  name: string; // [cite: 115]
  description: string; // [cite: 116]
  address: string; // [cite: 117]
  phone: string; // [cite: 118]
  email: string; // [cite: 119]
  logo_url: string; // [cite: 120]
  total_tables: number; // [cite: 123]
  operating_hours: object; // [cite: 124]
  currency: string; // [cite: 125]
  settings: object; // [cite: 121]
  created_at: Date;
  updated_at: Date;
}

const RestaurantSchema: Schema = new Schema(
  {
    name: { type: String, required: true }, // [cite: 115]
    description: { type: String }, // [cite: 116]
    address: { type: String }, // [cite: 117]
    phone: { type: String }, // [cite: 118]
    email: { type: String }, // [cite: 119]
    logo_url: { type: String }, // [cite: 120]
    total_tables: { type: Number, default: 0 }, // [cite: 123]
    operating_hours: { type: Object }, // [cite: 124]
    currency: { type: String, default: 'INR' }, // [cite: 125]
    settings: { type: Object, default: {} }, // [cite: 121]
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }, // [cite: 126, 127]
  }
);

export default mongoose.models.Restaurant ||
  mongoose.model<IRestaurant>('Restaurant', RestaurantSchema);