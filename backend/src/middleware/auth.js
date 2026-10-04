import { verifyAccess } from '../utils/token.js';
import { ApiError } from '../utils/ApiError.js';
import User from '../models/User.js';

export const requireAuth = async (req, _res, next) => {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) throw new ApiError(401, 'Missing access token');
    const payload = verifyAccess(token);
    const user = await User.findById(payload.sub).select('_id role email name');
    if (!user) throw new ApiError(401, 'User not found');
    req.user = user;
    next();
  } catch (e) { next(new ApiError(401, 'Unauthorized')); }
};

export const requireAdmin = (req, _res, next) => {
  if (req.user?.role !== 'admin') return next(new ApiError(403, 'Admin only'));
  next();
};

export const optionalAuth = async (req, _res, next) => {
  try {
    const h = req.headers.authorization || '';
    if (!h.startsWith('Bearer ')) return next();
    const payload = verifyAccess(h.slice(7));
    const user = await User.findById(payload.sub).select('_id role email name');
    if (user) req.user = user;
  } catch {}
  next();
};
