import { body } from 'express-validator';
export const createOrderRules = [
  body('items').isArray({ min: 1 }),
  body('items.*.product').isMongoId(),
  body('items.*.qty').isInt({ min: 1, max: 20 }),
  body('shippingAddress.fullName').isString().notEmpty(),
  body('shippingAddress.phone').isString().notEmpty(),
  body('shippingAddress.line1').isString().notEmpty(),
  body('shippingAddress.city').isString().notEmpty(),
  body('shippingAddress.pincode').isString().notEmpty(),
];
