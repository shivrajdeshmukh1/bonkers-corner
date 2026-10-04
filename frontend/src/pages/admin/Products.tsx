import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import toast from 'react-hot-toast';
export default function Products() {
  const [items, setItems] = useState<any[]>([]);
  const load = () => api.get('/products?limit=100').then(r => setItems(r.data.data.items));
  useEffect(() => { load(); }, []);
  const del = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    await api.delete(`/admin/products/${id}`); toast.success('Deleted'); load();
  };
  return (
    <div>
      <div className="flex justify-between mb-4"><h1 className="text-2xl">Products</h1>
        <button className="btn-primary">+ New product</button></div>
      <table className="w-full text-sm">
        <thead className="text-left border-b"><tr><th className="py-2">Name</th><th>Price</th><th>Stock</th><th>Category</th><th></th></tr></thead>
        <tbody>{items.map(p=>(
          <tr key={p._id} className="border-b"><td className="py-2">{p.name}</td><td>₹{p.price}</td><td>{p.stock}</td><td>{p.category}</td>
          <td><button onClick={()=>del(p._id)} className="text-accent">Delete</button></td></tr>
        ))}</tbody>
      </table>
    </div>
  );
}
