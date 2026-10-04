import { Link, NavLink } from 'react-router-dom';
import { ShoppingBag, Heart, User, Search } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store';
import { toggleCart } from '../features/ui/uiSlice';

export default function Navbar() {
  const dispatch = useAppDispatch();
  const count = useAppSelector(s => s.cart.items.reduce((n, i) => n + i.qty, 0));
  const user = useAppSelector(s => s.auth.user);

  const link = ({ isActive }: { isActive: boolean }) =>
    `text-sm tracking-wide uppercase ${isActive ? 'text-ink' : 'text-muted hover:text-ink'}`;

  return (
    <header className="sticky top-0 z-40 bg-bone/90 backdrop-blur border-b border-black/5">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-6">
        <Link to="/" className="font-display text-2xl tracking-tight">BONKERS<span className="text-accent">.</span>CORNER</Link>
        <nav className="hidden md:flex gap-6">
          <NavLink to="/shop/men" className={link}>Men</NavLink>
          <NavLink to="/shop/women" className={link}>Women</NavLink>
          <NavLink to="/shop" className={link}>New</NavLink>
        </nav>
        <div className="flex items-center gap-4">
          <Link to="/shop" aria-label="Search"><Search size={20} /></Link>
          <Link to={user ? '/wishlist' : '/login'} aria-label="Wishlist"><Heart size={20} /></Link>
          <Link to={user ? '/account' : '/login'} aria-label="Account"><User size={20} /></Link>
          <button onClick={() => dispatch(toggleCart())} className="relative" aria-label="Cart">
            <ShoppingBag size={20} />
            {count > 0 && <span className="absolute -top-2 -right-2 bg-accent text-white text-[10px] rounded-full w-5 h-5 grid place-items-center">{count}</span>}
          </button>
        </div>
      </div>
    </header>
  );
}
