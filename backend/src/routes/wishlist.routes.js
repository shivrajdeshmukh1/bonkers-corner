import { Router } from 'express';
import * as c from '../controllers/wishlist.controller.js';
import { requireAuth } from '../middleware/auth.js';
const r = Router();
r.use(requireAuth);
r.get('/', c.get);
r.post('/toggle', c.toggle);
export default r;
