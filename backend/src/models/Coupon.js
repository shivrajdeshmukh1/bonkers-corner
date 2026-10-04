import mongoose from 'mongoose';
const CouponSchema = new mongoose.Schema({
  code: { type: String, required: true, uppercase: true, unique: true, index: true },
  discountType: { type: String, enum: ['percent','flat'], required: true },
  discountValue: { type: Number, required: true, min: 0 },
  minOrder: { type: Number, default: 0 },
  expiryDate: Date,
  active: { type: Boolean, default: true },
  usageLimit: { type: Number, default: 0 }, // 0 = unlimited
  used: { type: Number, default: 0 },
}, { timestamps: true });
export default mongoose.model('Coupon', CouponSchema);
