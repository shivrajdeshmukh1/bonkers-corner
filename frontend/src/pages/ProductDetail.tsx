import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api } from '../lib/api';
import { useAppDispatch } from '../store';
import { addItem } from '../features/cart/cartSlice';
import { openCart } from '../features/ui/uiSlice';

export default function ProductDetail() {
  const { slug } = useParams();
  const dispatch = useAppDispatch();
  const [data, setData] = useState<any>(null);
  const [idx, setIdx] = useState(0);
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [qty, setQty] = useState(1);

  useEffect(() => {
    setData(null);
    api.get(`/products/${slug}`).then(r => setData(r.data.data));
  }, [slug]);

  if (!data) return <div className="max-w-7xl mx-auto px-4 py-16">Loading…</div>;
  const p = data.product;
  const price = p.discountPrice ?? p.price;

  const add = () => {
    if (p.sizes?.length && !size) return toast.error('Please pick a size');
    dispatch(addItem({
      productId: p._id, slug: p.slug, name: p.name,
      image: p.images?.[0]?.url, price, size, color, qty, stock: p.stock,
    }));
    toast.success('Added to bag');
    dispatch(openCart());
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid md:grid-cols-2 gap-12">
      <div>
        <img src={p.images?.[idx]?.url} alt={p.name} className="w-full aspect-[3/4] object-cover rounded-2xl"/>
        <div className="mt-3 grid grid-cols-5 gap-2">
          {p.images?.map((img: any, i: number) => (
            <button key={i} onClick={() => setIdx(i)} className={`aspect-square rounded overflow-hidden ${i===idx?'ring-2 ring-ink':''}`}>
              <img src={img.url} className="w-full h-full object-cover" alt=""/>
            </button>
          ))}
        </div>
      </div>
      <div>
        <h1 className="text-3xl">{p.name}</h1>
        <div className="mt-3 flex gap-3 items-baseline">
          <span className="text-2xl font-semibold">₹{price}</span>
          {p.discountPrice && <span className="line-through text-muted">₹{p.price}</span>}
        </div>
        <p className="text-muted mt-4">{p.description}</p>

        {p.sizes?.length > 0 && (
          <div className="mt-6">
            <div className="text-sm font-semibold mb-2">Size</div>
            <div className="flex flex-wrap gap-2">
              {p.sizes.map((s: string) => (
                <button key={s} onClick={() => setSize(s)}
                  className={`px-4 py-2 border rounded ${size===s?'bg-ink text-bone':''}`}>{s}</button>
              ))}
            </div>
          </div>
        )}

        {p.colors?.length > 0 && (
          <div className="mt-4">
            <div className="text-sm font-semibold mb-2">Color</div>
            <div className="flex gap-2">
              {p.colors.map((c: any) => (
                <button key={c.name} onClick={() => setColor(c.name)}
                  aria-label={c.name}
                  className={`w-8 h-8 rounded-full border-2 ${color===c.name?'ring-2 ring-ink':''}`}
                  style={{background: c.hex}} />
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 flex items-center gap-3">
          <div className="flex items-center border rounded">
            <button className="px-3 py-2" onClick={() => setQty(q => Math.max(1, q-1))}>-</button>
            <span className="px-4">{qty}</span>
            <button className="px-3 py-2" onClick={() => setQty(q => Math.min(p.stock, q+1))}>+</button>
          </div>
          <button className="btn-primary flex-1" onClick={add} disabled={p.stock === 0}>
            {p.stock === 0 ? 'Sold out' : 'Add to bag'}
          </button>
        </div>

        <div className="mt-8">
          <h3 className="text-xl mb-3">Reviews ({p.numReviews})</h3>
          {data.reviews.length === 0 && <p className="text-muted text-sm">No reviews yet.</p>}
          <ul className="space-y-3">
            {data.reviews.map((r: any) => (
              <li key={r._id} className="border-b pb-3">
                <div className="text-sm font-semibold">{r.user?.name} · {'★'.repeat(r.rating)}</div>
                <p className="text-sm text-muted">{r.comment}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
