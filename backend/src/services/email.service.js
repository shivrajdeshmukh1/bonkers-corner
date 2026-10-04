import { transporter } from '../config/mailer.js';

export async function sendOrderConfirmation(order, to) {
  const items = order.items.map(i => `<li>${i.name} × ${i.qty} — ₹${i.price * i.qty}</li>`).join('');
  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to,
    subject: `Bonkers Corner — Order #${order._id} confirmed`,
    html: `<h2>Thanks for your order!</h2>
      <p>Order <b>#${order._id}</b> — Total <b>₹${order.totalAmount}</b></p>
      <ul>${items}</ul>
      <p>We'll email you when it ships.</p>`,
  });
}
