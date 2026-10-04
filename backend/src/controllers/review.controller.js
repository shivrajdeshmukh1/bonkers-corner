import Review from '../models/Review.js';
import Order from '../models/Order.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ok, created } from '../utils/apiResponse.js';
import { ApiError } from '../utils/ApiError.js';

export const create = asyncHandler(async (req, res) => {
  const { productId, rating, comment } = req.body;
  // Only buyers can review
  const bought = await Order.exists({
    user: req.user._id, 'items.product': productId, 'paymentInfo.status': 'paid',
  });
  if (!bought) throw new ApiError(403, 'You can only review purchased items');
  const review = await Review.findOneAndUpdate(
    { product: productId, user: req.user._id },
    { rating, comment }, { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  await Review.recomputeStats(productId);
  created(res, { review });
});

export const listForProduct = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId })
    .populate('user', 'name').sort({ createdAt: -1 });
  ok(res, { reviews });
});
