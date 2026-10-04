import { Router } from 'express';
import { webhook } from '../controllers/payment.controller.js';
const r = Router();
// body is raw here because of the express.raw() mount in app.js
r.post('/webhook', webhook);
export default r;
