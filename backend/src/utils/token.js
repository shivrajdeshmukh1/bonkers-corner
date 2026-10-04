import jwt from 'jsonwebtoken';
export const signAccess = (user) =>
  jwt.sign({ sub: user._id, role: user.role }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES,
  });
export const signRefresh = (user) =>
  jwt.sign({ sub: user._id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES,
  });
export const verifyAccess = (t) => jwt.verify(t, process.env.JWT_ACCESS_SECRET);
export const verifyRefresh = (t) => jwt.verify(t, process.env.JWT_REFRESH_SECRET);
