import mongoose, { Schema, Document } from 'mongoose';

// Interface for TypeScript
export interface IUser extends Document {
  email: string;
  password?: string; // Password is required for creation, but optional to select
  phone: string;
  role: 'customer' | 'admin' | 'staff' | 'chef';
  restaurant_id: Schema.Types.ObjectId;
  created_at: Date;
  updated_at: Date;
}

const UserSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true }, // [cite: 104]
    password: { type: String, required: true, select: false }, // [cite: 105] Hashed, set select: false
    phone: { type: String }, // [cite: 106]
    role: {
      type: String,
      enum: ['customer', 'admin', 'staff', 'chef'], // [cite: 107]
      default: 'customer',
    },
    restaurant_id: { type: Schema.Types.ObjectId, ref: 'Restaurant' }, // [cite: 108]
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }, // [cite: 109, 110]
  }
);

// Avoid recompiling the model if it's already defined
export default mongoose.models.User ||
  mongoose.model<IUser>('User', UserSchema);