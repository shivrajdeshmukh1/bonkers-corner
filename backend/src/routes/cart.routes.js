import { Router } from 'express';
import * as c from '../controllers/cart.controller.js';
import { requireAuth } from '../middleware/auth.js';
const r = Router();
r.use(requireAuth);
r.get('/', c.getCart);
r.put('/', c.setCart);
r.delete('/', c.clear);
export default r;
