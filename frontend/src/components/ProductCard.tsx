import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store';
import { toggle } from '../features/wishlist/wishlistSlice';

export type Product = {
  _id: string; slug: string; name: string; price: number; discountPrice?: number;
  images: { url: string }[]; category: string;
};

export default function ProductCard({ p }: { p: Product }) {
  const dispatch = useAppDispatch();
  const wished = useAppSelector(s => s.wishlist.ids.includes(p._id));
  const img = p.images?.[0]?.url || 'https://placehold.co/600x800/eee/999?text=Bonkers';
  return (
    <div className="group relative">
      <Link to={`/product/${p.slug}`} className="block card">
        <div className="aspect-[3/4] overflow-hidden bg-black/5">
          <img src={img} alt={p.name} loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
        </div>
        <div className="p-3">
          <div className="text-sm">{p.name}</div>
          <div className="mt-1 flex gap-2 items-baseline">
            <span className="font-semibold">₹{p.discountPrice ?? p.price}</span>
            {p.discountPrice && <span className="text-xs text-muted line-through">₹{p.price}</span>}
          </div>
        </div>
      </Link>
      <button onClick={() => dispatch(toggle(p._id))}
        aria-label="Toggle wishlist"
        className="absolute top-3 right-3 bg-white/90 rounded-full p-2 shadow">
        <Heart size={16} className={wished ? 'fill-accent text-accent' : ''} />
      </button>
    </div>
  );
}
