import * as mongoose from 'mongoose';

export const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: false },
  id: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  state: { type: Boolean, required: false, default: true },
  image: { type: String, required: false, default: 'no-image.jpg' },
});
