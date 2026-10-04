import Cart from '../models/Cart.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ok } from '../utils/apiResponse.js';

export const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  ok(res, { cart: cart || { items: [] } });
});

export const setCart = asyncHandler(async (req, res) => {
  const { items } = req.body;
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id }, { items }, { upsert: true, new: true }
  ).populate('items.product');
  ok(res, { cart });
});

export const clear = asyncHandler(async (req, res) => {
  await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
  ok(res, null, 'Cart cleared');
});
