import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import { closeCart } from '../features/ui/uiSlice';
import { removeItem, updateQty } from '../features/cart/cartSlice';

export default function CartDrawer() {
  const dispatch = useAppDispatch();
  const open = useAppSelector(s => s.ui.cartOpen);
  const items = useAppSelector(s => s.cart.items);
  const subtotal = items.reduce((n, i) => n + i.price * i.qty, 0);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            className="fixed inset-0 bg-black/40 z-50" onClick={() => dispatch(closeCart())} />
          <motion.aside
            initial={{x:'100%'}} animate={{x:0}} exit={{x:'100%'}}
            transition={{type:'tween', duration:0.25}}
            className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-bone z-50 flex flex-col">
            <header className="flex items-center justify-between p-4 border-b border-black/5">
              <h3 className="font-display text-xl">Your Bag ({items.length})</h3>
              <button onClick={() => dispatch(closeCart())} aria-label="Close"><X /></button>
            </header>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {items.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-muted">Your bag is empty.</p>
                  <Link to="/shop" onClick={() => dispatch(closeCart())} className="btn-primary mt-4">Shop now</Link>
                </div>
              )}
              {items.map((i, idx) => (
                <div key={idx} className="flex gap-3">
                  <img src={i.image} className="w-20 h-24 object-cover rounded" alt={i.name}/>
                  <div className="flex-1">
                    <div className="text-sm">{i.name}</div>
                    <div className="text-xs text-muted">{i.size} / {i.color}</div>
                    <div className="mt-2 flex items-center gap-2">
                      <button className="px-2 border rounded" onClick={() => dispatch(updateQty({index: idx, qty: i.qty - 1}))}>-</button>
                      <span className="w-6 text-center">{i.qty}</span>
                      <button className="px-2 border rounded" onClick={() => dispatch(updateQty({index: idx, qty: i.qty + 1}))}>+</button>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">₹{i.price * i.qty}</div>
                    <button onClick={() => dispatch(removeItem(idx))} className="mt-2 text-muted"><Trash2 size={16}/></button>
                  </div>
                </div>
              ))}
            </div>
            {items.length > 0 && (
              <footer className="p-4 border-t border-black/5 space-y-3">
                <div className="flex justify-between"><span>Subtotal</span><span className="font-semibold">₹{subtotal}</span></div>
                <Link to="/checkout" onClick={() => dispatch(closeCart())} className="btn-primary w-full">Checkout</Link>
                <Link to="/cart" onClick={() => dispatch(closeCart())} className="btn-outline w-full">View bag</Link>
              </footer>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
