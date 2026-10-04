import { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { api } from '../lib/api';
import ProductCard, { type Product } from '../components/ProductCard';
import ProductGridSkeleton from '../components/ProductGridSkeleton';
import { useDebounce } from '../hooks/useDebounce';

const SIZES = ['XS','S','M','L','XL'];

export default function ProductList() {
  const { category } = useParams();
  const [sp, setSp] = useSearchParams();
  const [items, setItems] = useState<Product[] | null>(null);
  const q = sp.get('q') || '';
  const size = sp.get('size') || '';
  const sort = sp.get('sort') || 'newest';
  const [minP, setMinP] = useState(Number(sp.get('minPrice') || 0));
  const [maxP, setMaxP] = useState(Number(sp.get('maxPrice') || 5000));
  const debouncedQ = useDebounce(q);

  const params = useMemo(() => {
    const p = new URLSearchParams();
    if (category) p.set('category', category);
    if (debouncedQ) p.set('q', debouncedQ);
    if (size) p.set('size', size);
    if (sort) p.set('sort', sort);
    if (minP) p.set('minPrice', String(minP));
    if (maxP) p.set('maxPrice', String(maxP));
    return p.toString();
  }, [category, debouncedQ, size, sort, minP, maxP]);

  useEffect(() => {
    setItems(null);
    api.get(`/products?${params}`).then(r => setItems(r.data.data.items));
  }, [params]);

  const update = (k: string, v: string) => {
    const n = new URLSearchParams(sp); v ? n.set(k, v) : n.delete(k); setSp(n);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid md:grid-cols-[240px_1fr] gap-8">
      <aside className="space-y-6">
        <div>
          <label className="text-sm font-semibold">Search</label>
          <input value={q} onChange={e => update('q', e.target.value)} className="w-full mt-2 px-3 py-2 rounded border"/>
        </div>
        <div>
          <div className="text-sm font-semibold mb-2">Size</div>
          <div className="flex flex-wrap gap-2">
            {SIZES.map(s => (
              <button key={s} onClick={() => update('size', size === s ? '' : s)}
                className={`px-3 py-1 border rounded-full text-sm ${size === s ? 'bg-ink text-bone' : ''}`}>{s}</button>
            ))}
          </div>
        </div>
        <div>
          <div className="text-sm font-semibold mb-2">Price</div>
          <div className="flex gap-2">
            <input type="number" value={minP} onChange={e => setMinP(+e.target.value)} className="w-full px-2 py-1 border rounded"/>
            <input type="number" value={maxP} onChange={e => setMaxP(+e.target.value)} className="w-full px-2 py-1 border rounded"/>
          </div>
        </div>
      </aside>

      <section>
        <div className="flex justify-between mb-6">
          <h1 className="text-3xl capitalize">{category || 'All'}</h1>
          <select value={sort} onChange={e => update('sort', e.target.value)} className="px-3 py-2 border rounded">
            <option value="newest">Newest</option>
            <option value="priceAsc">Price: Low to High</option>
            <option value="priceDesc">Price: High to Low</option>
            <option value="popular">Popular</option>
          </select>
        </div>
        {!items ? <ProductGridSkeleton /> :
          items.length === 0 ? (
            <div className="py-24 text-center text-muted">
              <p className="text-xl">No products match your filters.</p>
              <button className="btn-outline mt-4" onClick={() => setSp({})}>Reset filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {items.map(p => <ProductCard key={p._id} p={p} />)}
            </div>
          )
        }
      </section>
    </div>
  );
}
