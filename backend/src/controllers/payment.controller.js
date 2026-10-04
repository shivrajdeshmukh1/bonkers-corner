import { stripe } from '../config/stripe.js';
import { markPaid } from './order.controller.js';

// req.body is a Buffer here — mounted with express.raw() in app.js
export const webhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  if (event.type === 'payment_intent.succeeded') await markPaid(event.data.object);
  res.json({ received: true });
};
