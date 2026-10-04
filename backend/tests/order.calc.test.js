import { jest } from '@jest/globals';

jest.unstable_mockModule('../src/models/Product.js', () => ({
  default: {
    find: async () => ([
      { _id: 'p1', name: 'Tee', price: 500, discountPrice: 400, stock: 10, images: [{url:'x'}] },
      { _id: 'p2', name: 'Pant', price: 1000, stock: 5, images: [{url:'y'}] },
    ]),
  },
}));
jest.unstable_mockModule('../src/models/Coupon.js', () => ({
  default: { findOne: async () => ({ code: 'SAVE10', discountType: 'percent', discountValue: 10, minOrder: 0, active: true, used: 0, usageLimit: 0 }) },
}));

const { calculateOrder } = await import('../src/services/order.service.js');

test('calculates totals with discountPrice + coupon + shipping', async () => {
  const t = await calculateOrder(
    [{ product: 'p1', qty: 2 }, { product: 'p2', qty: 1 }],
    'SAVE10'
  );
  // items = 400*2 + 1000 = 1800; discount = 10% of 1800 = 180
  // taxable = 1620; tax = 5% = 81; shipping = 0 (>= 999); total = 1701
  expect(t.itemsPrice).toBe(1800);
  expect(t.discount).toBe(180);
  expect(t.taxPrice).toBe(81);
  expect(t.shippingPrice).toBe(0);
  expect(t.totalAmount).toBe(1701);
});
