import Product from '../models/Product.js';
import Review from '../models/Review.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ok, created } from '../utils/apiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { uploadBuffer, destroyImage } from '../services/upload.service.js';

export const list = asyncHandler(async (req, res) => {
  const {
    q, category, subCategory, size, color, minPrice, maxPrice,
    sort = 'newest', page = 1, limit = 24, featured, newArrival, bestSeller,
  } = req.query;

  const filter = {};
  if (q) filter.$text = { $search: q };
  if (category) filter.category = category;
  if (subCategory) filter.subCategory = subCategory;
  if (size) filter.sizes = size;
  if (color) filter['colors.name'] = color;
  if (minPrice || maxPrice) filter.price = {
    ...(minPrice && { $gte: Number(minPrice) }),
    ...(maxPrice && { $lte: Number(maxPrice) }),
  };
  if (featured) filter.isFeatured = true;
  if (newArrival) filter.isNewArrival = true;
  if (bestSeller) filter.isBestSeller = true;

  const sortMap = {
    newest: { createdAt: -1 },
    priceAsc: { price: 1 },
    priceDesc: { price: -1 },
    popular: { ratingsAvg: -1, numReviews: -1 },
  };
  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Product.find(filter).sort(sortMap[sort] || sortMap.newest).skip(skip).limit(Number(limit)),
    Product.countDocuments(filter),
  ]);
  ok(res, { items, total, page: Number(page), pages: Math.ceil(total / limit) });
});

export const bySlug = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug });
  if (!product) throw new ApiError(404, 'Product not found');
  const reviews = await Review.find({ product: product._id })
    .populate('user', 'name').sort({ createdAt: -1 }).limit(20);
  ok(res, { product, reviews });
});

export const suggest = asyncHandler(async (req, res) => {
  const q = (req.query.q || '').trim();
  if (!q) return ok(res, { items: [] });
  const items = await Product.find({ name: new RegExp(q, 'i') }).select('name slug images price').limit(8);
  ok(res, { items });
});

// admin
export const create = asyncHandler(async (req, res) => {
  const files = req.files || [];
  const images = await Promise.all(files.map(f => uploadBuffer(f.buffer)));
  const p = await Product.create({ ...req.body, images, price: Number(req.body.price),
    discountPrice: req.body.discountPrice ? Number(req.body.discountPrice) : undefined,
    stock: Number(req.body.stock || 0),
    sizes: JSON.parse(req.body.sizes || '[]'),
    colors: JSON.parse(req.body.colors || '[]'),
  });
  created(res, { product: p });
});

export const update = asyncHandler(async (req, res) => {
  const p = await Product.findById(req.params.id);
  if (!p) throw new ApiError(404, 'Not found');
  const files = req.files || [];
  if (files.length) {
    const newImages = await Promise.all(files.map(f => uploadBuffer(f.buffer)));
    p.images.push(...newImages);
  }
  Object.assign(p, req.body);
  if (req.body.sizes) p.sizes = JSON.parse(req.body.sizes);
  if (req.body.colors) p.colors = JSON.parse(req.body.colors);
  await p.save();
  ok(res, { product: p });
});

export const remove = asyncHandler(async (req, res) => {
  const p = await Product.findById(req.params.id);
  if (!p) throw new ApiError(404, 'Not found');
  await Promise.all(p.images.map(i => destroyImage(i.publicId).catch(() => {})));
  await p.deleteOne();
  ok(res, null, 'Deleted');
});
