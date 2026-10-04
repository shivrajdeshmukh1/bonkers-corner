import mongoose from 'mongoose';
import Product from './Product.js';

const ReviewSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, maxlength: 1000 },
}, { timestamps: true });

ReviewSchema.index({ product: 1, user: 1 }, { unique: true });

ReviewSchema.statics.recomputeStats = async function (productId) {
  const [agg] = await this.aggregate([
    { $match: { product: new mongoose.Types.ObjectId(productId) } },
    { $group: { _id: '$product', avg: { $avg: '$rating' }, n: { $sum: 1 } } },
  ]);
  await Product.findByIdAndUpdate(productId, {
    ratingsAvg: agg?.avg || 0, numReviews: agg?.n || 0,
  });
};
ReviewSchema.post('save', function () { this.constructor.recomputeStats(this.product); });
ReviewSchema.post('deleteOne', { document: true, query: false }, function () {
  this.constructor.recomputeStats(this.product);
});

export default mongoose.model('Review', ReviewSchema);
