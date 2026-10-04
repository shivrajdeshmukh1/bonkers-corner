import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ok } from '../utils/apiResponse.js';

export const get = asyncHandler(async (req, res) => {
  const u = await User.findById(req.user._id).populate('wishlist');
  ok(res, { wishlist: u.wishlist });
});
export const toggle = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const u = await User.findById(req.user._id);
  const idx = u.wishlist.findIndex(p => String(p) === productId);
  if (idx >= 0) u.wishlist.splice(idx, 1); else u.wishlist.push(productId);
  await u.save();
  ok(res, { wishlist: u.wishlist });
});
