import { Router } from 'express';
import { register, login, refresh, logout, me } from '../controllers/auth.controller.js';
import { registerRules, loginRules } from '../validators/auth.validator.js';
import { validate } from '../middleware/validate.js';
import { requireAuth } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimit.js';

const r = Router();
r.post('/register', authLimiter, registerRules, validate, register);
r.post('/login', authLimiter, loginRules, validate, login);
r.post('/refresh', refresh);
r.post('/logout', logout);
r.get('/me', requireAuth, me);
export default r;
