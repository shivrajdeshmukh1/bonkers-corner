import Product from '../models/Product.js';
import Coupon from '../models/Coupon.js';
import { ApiError } from '../utils/ApiError.js';

const SHIPPING_FLAT = 49;
const FREE_SHIPPING_THRESHOLD = 999;
const TAX_RATE = 0.05;

/**
 * Compute order totals server-side. NEVER trust client-sent prices.
 */
export async function calculateOrder(rawItems, couponCode) {
  if (!rawItems?.length) throw new ApiError(400, 'Cart is empty');
  const ids = rawItems.map(i => i.product);
  const products = await Product.find({ _id: { $in: ids } });
  const map = new Map(products.map(p => [String(p._id), p]));

  const items = rawItems.map(i => {
    const p = map.get(String(i.product));
    if (!p) throw new ApiError(400, `Product ${i.product} not found`);
    if (p.stock < i.qty) throw new ApiError(400, `Insufficient stock for ${p.name}`);
    const price = p.discountPrice ?? p.price;
    return {
      product: p._id, name: p.name, image: p.images?.[0]?.url,
      size: i.size, color: i.color, qty: i.qty, price,
    };
  });

  const itemsPrice = items.reduce((s, i) => s + i.price * i.qty, 0);
  const shippingPrice = itemsPrice >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT;

  let discount = 0;
  if (couponCode) {
    const c = await Coupon.findOne({ code: couponCode.toUpperCase(), active: true });
    if (!c) throw new ApiError(400, 'Invalid coupon');
    if (c.expiryDate && c.expiryDate < new Date()) throw new ApiError(400, 'Coupon expired');
    if (c.usageLimit && c.used >= c.usageLimit) throw new ApiError(400, 'Coupon exhausted');
    if (itemsPrice < c.minOrder) throw new ApiError(400, `Min order ₹${c.minOrder}`);
    discount = c.discountType === 'percent'
      ? Math.round((itemsPrice * c.discountValue) / 100)
      : c.discountValue;
    discount = Math.min(discount, itemsPrice);
  }

  const taxable = Math.max(itemsPrice - discount, 0);
  const taxPrice = Math.round(taxable * TAX_RATE);
  const totalAmount = taxable + taxPrice + shippingPrice;
  return { items, itemsPrice, shippingPrice, taxPrice, discount, totalAmount };
}

export async function decrementStock(items) {
  await Promise.all(items.map(i =>
    Product.updateOne({ _id: i.product, stock: { $gte: i.qty } }, { $inc: { stock: -i.qty } })
  ));
}
