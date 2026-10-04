import { useEffect, useState } from 'react';
import { api } from '../lib/api';

const STATUSES = ['placed','packed','shipped','delivered'];

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  useEffect(() => { api.get('/orders/mine').then(r => setOrders(r.data.data.orders)); }, []);
  if (orders.length === 0) return <div className="max-w-3xl mx-auto py-16 text-center text-muted">No orders yet.</div>;
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-4">
      <h1 className="text-3xl mb-4">Your orders</h1>
      {orders.map(o => (
        <div key={o._id} className="card p-4">
          <div className="flex justify-between"><span>#{o._id.slice(-8)}</span><span className="font-semibold">₹{o.totalAmount}</span></div>
          <div className="mt-3 flex gap-2 text-xs">
            {STATUSES.map((s,i) => {
              const idx = STATUSES.indexOf(o.orderStatus);
              return <span key={s} className={`px-2 py-1 rounded ${i <= idx ? 'bg-ink text-bone' : 'bg-black/5 text-muted'}`}>{s}</span>;
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
