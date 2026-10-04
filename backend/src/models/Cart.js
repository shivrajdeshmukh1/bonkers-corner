import mongoose from 'mongoose';
const CartItem = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  size: String, color: String, qty: { type: Number, default: 1, min: 1 },
}, { _id: false });
const CartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true },
  items: [CartItem],
}, { timestamps: true });
export default mongoose.model('Cart', CartSchema);
