import mongoose, { Schema, Document } from 'mongoose';

interface IPortion {
  type: string; // e.g., 'small', 'medium', 'large'
  price_adjustment: number; // e.g., -2, 0, +4
}

export interface IMenuItem extends Document {
  restaurant_id: Schema.Types.ObjectId;
  name: string;
  description: string;
  price: number; // Base price
  category: string;
  image_url: string;
  portions: IPortion[];
  is_available: boolean;
  dietary_tags: string[]; // e.g., 'vegan', 'gluten-free'
  created_at: Date;
  updated_at: Date;
}

const PortionSchema: Schema = new Schema({
  type: { type: String, required: true },
  price_adjustment: { type: Number, default: 0 },
});

const MenuItemSchema: Schema = new Schema(
  {
    restaurant_id: {
      type: Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
    },
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true }, // Base price
    category: { type: String, required: true, index: true },
    image_url: { type: String },
    portions: { type: [PortionSchema], default: [] }, //
    is_available: { type: Boolean, default: true },
    dietary_tags: { type: [String], default: [] }, //
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

export default mongoose.models.MenuItem ||
  mongoose.model<IMenuItem>('MenuItem', MenuItemSchema);