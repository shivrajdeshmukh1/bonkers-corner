import mongoose from 'mongoose';
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, index: 'text' },
  slug: { type: String, unique: true, index: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  discountPrice: { type: Number, min: 0 },
  images: [{ url: String, publicId: String }],
  sizes: [{ type: String }],   // XS, S, M, L, XL, XXL
  colors: [{ name: String, hex: String }],
  stock: { type: Number, default: 0, min: 0 },
  category: { type: String, required: true, index: true },      // men, women, kids
  subCategory: { type: String, index: true },                    // t-shirts, jeans...
  ratingsAvg: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false, index: true },
  isNewArrival: { type: Boolean, default: false, index: true },
  isBestSeller: { type: Boolean, default: false, index: true },
}, { timestamps: true });

ProductSchema.pre('validate', function (next) {
  if (!this.slug && this.name) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + Date.now().toString(36);
  }
  next();
});

export default mongoose.model('Product', ProductSchema);
