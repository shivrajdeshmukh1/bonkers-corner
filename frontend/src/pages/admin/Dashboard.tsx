import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
export default function Dashboard() {
  const [d, setD] = useState<any>(null);
  useEffect(() => { api.get('/admin/dashboard').then(r => setD(r.data.data)); }, []);
  if (!d) return <p>Loading…</p>;
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <Stat label="Revenue" value={`₹${d.revenue}`} />
        <Stat label="Orders today" value={d.ordersToday} />
        <Stat label="Total orders" value={d.totalOrders} />
      </div>
      <div className="card p-4">
        <h3 className="font-semibold mb-3">Sales (last 30d)</h3>
        <div style={{height: 260}}>
          <ResponsiveContainer><LineChart data={d.salesSeries}>
            <XAxis dataKey="_id"/><YAxis/><Tooltip/>
            <Line type="monotone" dataKey="revenue" stroke="#e63946" strokeWidth={2} dot={false}/>
          </LineChart></ResponsiveContainer>
        </div>
      </div>
      <div className="card p-4">
        <h3 className="font-semibold mb-3">Low stock</h3>
        <ul className="text-sm divide-y">{d.lowStock.map((p:any)=>(<li key={p._id} className="py-2 flex justify-between"><span>{p.name}</span><span className="text-accent">{p.stock} left</span></li>))}</ul>
      </div>
    </div>
  );
}
function Stat({label, value}:{label:string; value:any}) {
  return <div className="card p-4"><div className="text-sm text-muted">{label}</div><div className="text-2xl font-semibold mt-1">{value}</div></div>;
}
