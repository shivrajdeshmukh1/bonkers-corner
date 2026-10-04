import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
export default function Orders() {
  const [items, setItems] = useState<any[]>([]);
  const load = () => api.get('/admin/orders').then(r => setItems(r.data.data.items));
  useEffect(() => { load(); }, []);
  const setStatus = async (id: string, status: string) => {
    await api.patch(`/admin/orders/${id}/status`, { status }); load();
  };
  return (
    <div>
      <h1 className="text-2xl mb-4">Orders</h1>
      <table className="w-full text-sm">
        <thead className="text-left border-b"><tr><th className="py-2">ID</th><th>Customer</th><th>Total</th><th>Status</th></tr></thead>
        <tbody>{items.map(o=>(
          <tr key={o._id} className="border-b">
            <td className="py-2">#{o._id.slice(-8)}</td>
            <td>{o.user?.email || o.guestEmail}</td>
            <td>₹{o.totalAmount}</td>
            <td><select value={o.orderStatus} onChange={e=>setStatus(o._id, e.target.value)} className="border rounded px-2 py-1">
              {['placed','packed','shipped','delivered','cancelled'].map(s=><option key={s}>{s}</option>)}
            </select></td>
          </tr>
        ))}</tbody>
      </table>
    </div>
  );
}
