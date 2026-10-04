import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ok } from '../utils/apiResponse.js';
import { ApiError } from '../utils/ApiError.js';

export const dashboard = asyncHandler(async (_req, res) => {
  const start = new Date(); start.setHours(0,0,0,0);
  const [revenueAgg, ordersToday, lowStock, salesSeries] = await Promise.all([
    Order.aggregate([
      { $match: { 'paymentInfo.status': 'paid' } },
      { $group: { _id: null, revenue: { $sum: '$totalAmount' }, count: { $sum: 1 } } },
    ]),
    Order.countDocuments({ createdAt: { $gte: start } }),
    Product.find({ stock: { $lte: 5 } }).select('name stock').limit(20),
    Order.aggregate([
      { $match: { 'paymentInfo.status': 'paid' } },
      { $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        revenue: { $sum: '$totalAmount' },
      }},
      { $sort: { _id: 1 } }, { $limit: 30 },
    ]),
  ]);
  ok(res, {
    revenue: revenueAgg[0]?.revenue || 0,
    totalOrders: revenueAgg[0]?.count || 0,
    ordersToday, lowStock, salesSeries,
  });
});

export const listOrders = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const filter = status ? { orderStatus: status } : {};
  const [items, total] = await Promise.all([
    Order.find(filter).populate('user', 'name email')
      .sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit)),
    Order.countDocuments(filter),
  ]);
  ok(res, { items, total });
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const o = await Order.findById(req.params.id);
  if (!o) throw new ApiError(404, 'Order not found');
  o.orderStatus = status;
  o.statusHistory.push({ status });
  await o.save();
  ok(res, { order: o });
});

export const listUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password -refreshTokens').sort({ createdAt: -1 });
  ok(res, { users });
});

export const toggleBlock = asyncHandler(async (req, res) => {
  const u = await User.findById(req.params.id);
  if (!u) throw new ApiError(404, 'User not found');
  u.blocked = !u.blocked;
  await u.save();
  ok(res, { user: u });
});
