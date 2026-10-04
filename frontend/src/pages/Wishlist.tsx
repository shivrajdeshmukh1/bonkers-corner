import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import ProductCard, { type Product } from '../components/ProductCard';
import { useAppSelector } from '../store';

export default function Wishlist() {
  const ids = useAppSelector(s => s.wishlist.ids);
  const [items, setItems] = useState<Product[]>([]);
  useEffect(() => {
    if (ids.length === 0) return setItems([]);
    Promise.all(ids.map(id => api.get(`/products/id/${id}`).catch(() => null)))
      .then(rs => setItems(rs.filter(Boolean).map(r => r!.data.data.product)));
  }, [ids]);
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl mb-6">Wishlist</h1>
      {items.length === 0 ? <p className="text-muted">No saved items.</p> :
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {items.map(p => <ProductCard key={p._id} p={p} />)}
        </div>}
    </div>
  );
}
