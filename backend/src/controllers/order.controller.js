import Order from '../models/Order.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ok, created } from '../utils/apiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { calculateOrder, decrementStock } from '../services/order.service.js';
import { stripe } from '../config/stripe.js';
import { sendOrderConfirmation } from '../services/email.service.js';

export const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress, couponCode, guestEmail } = req.body;
  const totals = await calculateOrder(items, couponCode);
  const order = await Order.create({
    user: req.user?._id, guestEmail: req.user ? undefined : guestEmail,
    items: totals.items, shippingAddress, couponCode,
    itemsPrice: totals.itemsPrice, shippingPrice: totals.shippingPrice,
    taxPrice: totals.taxPrice, discount: totals.discount,
    totalAmount: totals.totalAmount,
    statusHistory: [{ status: 'placed' }],
  });

  const intent = await stripe.paymentIntents.create({
    amount: totals.totalAmount * 100, currency: 'inr',
    metadata: { orderId: String(order._id) },
    automatic_payment_methods: { enabled: true },
  });
  order.paymentInfo.intentId = intent.id;
  await order.save();

  created(res, { order, clientSecret: intent.client_secret });
});

export const myOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  ok(res, { orders });
});

export const byId = asyncHandler(async (req, res) => {
  const o = await Order.findById(req.params.id);
  if (!o) throw new ApiError(404, 'Not found');
  if (String(o.user) !== String(req.user._id) && req.user.role !== 'admin')
    throw new ApiError(403, 'Forbidden');
  ok(res, { order: o });
});

// Called by Stripe webhook after successful payment
export const markPaid = async (intent) => {
  const order = await Order.findOne({ 'paymentInfo.intentId': intent.id });
  if (!order || order.paymentInfo.status === 'paid') return;
  order.paymentInfo.status = 'paid';
  order.paymentInfo.paidAt = new Date();
  await order.save();
  await decrementStock(order.items);
  const to = order.guestEmail || (await order.populate('user', 'email')).user?.email;
  if (to) sendOrderConfirmation(order, to).catch(console.error);
};
