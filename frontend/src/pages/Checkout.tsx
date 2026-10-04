import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addressSchema } from '../lib/schemas';
import { z } from 'zod';
import { useAppDispatch, useAppSelector } from '../store';
import { clearCart } from '../features/cart/cartSlice';
import { api } from '../lib/api';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
type AddrForm = z.infer<typeof addressSchema>;

export default function Checkout() {
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState<AddrForm | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const items = useAppSelector(s => s.cart.items);
  const user = useAppSelector(s => s.auth.user);

  const { register, handleSubmit, formState: { errors } } = useForm<AddrForm>({
    resolver: zodResolver(addressSchema),
  });

  const submitAddress = (a: AddrForm) => { setAddress(a); setStep(2); };
  const [guestEmail, setGuestEmail] = useState('');

  const createOrder = async () => {
    try {
      const body = {
        items: items.map(i => ({ product: i.productId, qty: i.qty, size: i.size, color: i.color })),
        shippingAddress: address, guestEmail: user ? undefined : guestEmail,
      };
      const r = await api.post('/orders', body);
      setClientSecret(r.data.data.clientSecret);
      setOrderId(r.data.data.order._id);
      setStep(3);
    } catch (e: any) { toast.error(e.response?.data?.message || 'Failed'); }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <ol className="flex gap-6 mb-8 text-sm">
        {['Address','Review','Payment'].map((label, i) => (
          <li key={label} className={`flex items-center gap-2 ${step >= i+1 ? 'text-ink' : 'text-muted'}`}>
            <span className={`w-6 h-6 grid place-items-center rounded-full ${step >= i+1 ? 'bg-ink text-bone' : 'bg-black/10'}`}>{i+1}</span>
            {label}
          </li>
        ))}
      </ol>

      {step === 1 && (
        <form onSubmit={handleSubmit(submitAddress)} className="grid gap-3">
          {!user && <input placeholder="Email" value={guestEmail} onChange={e=>setGuestEmail(e.target.value)} className="input" />}
          {(['fullName','phone','line1','line2','city','state','pincode'] as const).map(f => (
            <div key={f}>
              <input placeholder={f} {...register(f as any)} className="input"/>
              {errors[f as keyof AddrForm] && <p className="text-xs text-red-500">{errors[f as keyof AddrForm]?.message as string}</p>}
            </div>
          ))}
          <button className="btn-primary">Continue</button>
        </form>
      )}

      {step === 2 && address && (
        <div className="space-y-4">
          <div className="card p-4">
            <h3 className="font-semibold mb-2">Ship to</h3>
            <p className="text-sm">{address.fullName}, {address.line1}, {address.city} — {address.pincode}</p>
          </div>
          <ul className="card p-4 divide-y">
            {items.map((i, idx) => (
              <li key={idx} className="py-2 flex justify-between text-sm">
                <span>{i.name} × {i.qty}</span><span>₹{i.price * i.qty}</span>
              </li>
            ))}
          </ul>
          <button className="btn-primary w-full" onClick={createOrder}>Place order & pay</button>
        </div>
      )}

      {step === 3 && clientSecret && orderId && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <PaymentForm orderId={orderId} />
        </Elements>
      )}
    </div>
  );
}

function PaymentForm({ orderId }: { orderId: string }) {
  const stripe = useStripe(); const elements = useElements();
  const dispatch = useAppDispatch(); const nav = useNavigate();
  const [processing, setProcessing] = useState(false);

  const pay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setProcessing(true);
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: `${window.location.origin}/order/${orderId}/success` },
    });
    if (error) { toast.error(error.message || 'Payment failed'); setProcessing(false); }
    else { dispatch(clearCart()); nav(`/order/${orderId}/success`); }
  };

  return (
    <form onSubmit={pay} className="space-y-4">
      <PaymentElement />
      <button disabled={processing} className="btn-primary w-full">{processing ? 'Processing…' : 'Pay now'}</button>
    </form>
  );
}
