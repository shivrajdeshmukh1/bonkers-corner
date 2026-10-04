import { Router } from 'express';
import { requireAuth, requireAdmin } from '../../middleware/auth.js';
import { upload } from '../../middleware/upload.js';
import * as p from '../../controllers/product.controller.js';
import * as a from '../../controllers/admin.controller.js';

const r = Router();
r.use(requireAuth, requireAdmin); // CRITICAL: server-side gate on all /api/admin/*

r.get('/dashboard', a.dashboard);

// products
r.post('/products', upload.array('images', 8), p.create);
r.put('/products/:id', upload.array('images', 8), p.update);
r.delete('/products/:id', p.remove);

// orders
r.get('/orders', a.listOrders);
r.patch('/orders/:id/status', a.updateOrderStatus);

// users
r.get('/users', a.listUsers);
r.patch('/users/:id/block', a.toggleBlock);

export default r;
