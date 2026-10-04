import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import ProductCard, { type Product } from '../components/ProductCard';
import ProductGridSkeleton from '../components/ProductGridSkeleton';

export default function Home() {
  const [featured, setFeatured] = useState<Product[] | null>(null);
  const [newArr, setNewArr] = useState<Product[] | null>(null);

  useEffect(() => {
    api.get('/products?featured=1&limit=8').then(r => setFeatured(r.data.data.items));
    api.get('/products?newArrival=1&limit=8').then(r => setNewArr(r.data.data.items));
  }, []);

  return (
    <>
      <section className="relative bg-ink text-bone">
        <div className="max-w-7xl mx-auto px-4 py-24 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="uppercase text-accent tracking-widest text-sm">New Drop · SS26</p>
            <h1 className="text-5xl md:text-7xl mt-3">Wear the vibe.<br/>Break the rules.</h1>
            <p className="mt-6 text-bone/70 max-w-md">Oversized silhouettes, bold graphics, unapologetic street energy.</p>
            <Link to="/shop" className="btn-accent mt-8">Shop the drop</Link>
          </div>
          <img src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800" alt="" className="rounded-2xl object-cover aspect-square"/>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {['men','women','sale'].map(c => (
            <Link key={c} to={`/shop/${c}`} className="relative aspect-video card grid place-items-center hover:scale-[1.01] transition">
              <span className="font-display text-3xl uppercase">{c}</span>
            </Link>
          ))}
        </div>
      </section>

      <Section title="Featured" data={featured} />
      <Section title="New Arrivals" data={newArr} />
    </>
  );
}

function Section({ title, data }: { title: string; data: Product[] | null }) {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-end justify-between mb-6">
        <h2 className="text-3xl">{title}</h2>
        <Link to="/shop" className="text-sm underline">View all</Link>
      </div>
      {!data ? <ProductGridSkeleton /> : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {data.map(p => <ProductCard key={p._id} p={p} />)}
        </div>
      )}
    </section>
  );
}
