import User from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { signAccess, signRefresh, verifyRefresh } from '../utils/token.js';
import { ok, created } from '../utils/apiResponse.js';

const refreshCookie = (res, token) =>
  res.cookie('rt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/api/auth',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (await User.findOne({ email })) throw new ApiError(409, 'Email already registered');
  const user = await User.create({ name, email, password });
  const at = signAccess(user);
  const rt = signRefresh(user);
  user.refreshTokens.push({ token: rt });
  await user.save();
  refreshCookie(res, rt);
  created(res, { accessToken: at, user: { id: user._id, name, email, role: user.role } });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) throw new ApiError(401, 'Invalid credentials');
  if (user.blocked) throw new ApiError(403, 'Account blocked');
  const at = signAccess(user);
  const rt = signRefresh(user);
  user.refreshTokens.push({ token: rt });
  await user.save();
  refreshCookie(res, rt);
  ok(res, { accessToken: at, user: { id: user._id, name: user.name, email, role: user.role } });
});

export const refresh = asyncHandler(async (req, res) => {
  const rt = req.cookies?.rt;
  if (!rt) throw new ApiError(401, 'No refresh token');
  const payload = verifyRefresh(rt);
  const user = await User.findById(payload.sub);
  if (!user || !user.refreshTokens.some(t => t.token === rt)) throw new ApiError(401, 'Invalid refresh');
  // rotate
  user.refreshTokens = user.refreshTokens.filter(t => t.token !== rt);
  const newRt = signRefresh(user);
  user.refreshTokens.push({ token: newRt });
  await user.save();
  refreshCookie(res, newRt);
  ok(res, { accessToken: signAccess(user) });
});

export const logout = asyncHandler(async (req, res) => {
  const rt = req.cookies?.rt;
  if (rt) {
    try {
      const payload = verifyRefresh(rt);
      await User.findByIdAndUpdate(payload.sub, { $pull: { refreshTokens: { token: rt } } });
    } catch {}
  }
  res.clearCookie('rt', { path: '/api/auth' });
  ok(res, null, 'Logged out');
});

export const me = asyncHandler(async (req, res) => {
  ok(res, { user: req.user });
});
