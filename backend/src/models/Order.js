import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: String, image: String,
  size: String, color: String,
  qty: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true }, // snapshot
}, { _id: false });

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true }, // null = guest
  guestEmail: String,
  items: [OrderItemSchema],
  shippingAddress: {
    fullName: String, phone: String, line1: String, line2: String,
    city: String, state: String, pincode: String, country: String,
  },
  itemsPrice: Number,
  shippingPrice: Number,
  taxPrice: Number,
  discount: Number,
  couponCode: String,
  totalAmount: { type: Number, required: true },
  paymentInfo: {
    provider: { type: String, default: 'stripe' },
    intentId: String,
    status: { type: String, enum: ['pending','paid','failed','refunded'], default: 'pending' },
    paidAt: Date,
  },
  orderStatus: {
    type: String,
    enum: ['placed','packed','shipped','delivered','cancelled'],
    default: 'placed', index: true,
  },
  statusHistory: [{ status: String, at: { type: Date, default: Date.now } }],
}, { timestamps: true });

export default mongoose.model('Order', OrderSchema);
