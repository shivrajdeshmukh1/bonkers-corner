import { Router } from 'express';
import * as c from '../controllers/review.controller.js';
import { requireAuth } from '../middleware/auth.js';
const r = Router();
r.get('/:productId', c.listForProduct);
r.post('/', requireAuth, c.create);
export default r;
