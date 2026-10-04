import { Router } from 'express';
import * as c from '../controllers/product.controller.js';
const r = Router();
r.get('/', c.list);
r.get('/suggest', c.suggest);
r.get('/:slug', c.bySlug);
export default r;
