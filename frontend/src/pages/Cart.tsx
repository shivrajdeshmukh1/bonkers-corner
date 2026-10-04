import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import { removeItem, updateQty } from '../features/cart/cartSlice';

export default function Cart() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(s => s.cart.items);
  const subtotal = items.reduce((n, i) => n + i.price * i.qty, 0);

  if (items.length === 0) return (
    <div className="max-w-3xl mx-auto py-24 text-center">
      <h1 className="text-3xl mb-3">Your bag is empty</h1>
      <Link to="/shop" className="btn-primary mt-4">Shop the drop</Link>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-[1fr_360px] gap-8">
      <ul className="divide-y">
        {items.map((i, idx) => (
          <li key={idx} className="flex gap-4 py-4">
            <img src={i.image} className="w-24 h-32 object-cover rounded" alt=""/>
            <div className="flex-1">
              <div className="flex justify-between">
                <div><Link to={`/product/${i.slug}`} className="font-medium">{i.name}</Link>
                <div className="text-sm text-muted">{i.size} / {i.color}</div></div>
                <div className="font-semibold">₹{i.price * i.qty}</div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <button className="px-2 border rounded" onClick={() => dispatch(updateQty({index: idx, qty: i.qty - 1}))}>-</button>
                <span>{i.qty}</span>
                <button className="px-2 border rounded" onClick={() => dispatch(updateQty({index: idx, qty: i.qty + 1}))}>+</button>
                <button className="ml-4 text-sm text-muted underline" onClick={() => dispatch(removeItem(idx))}>Remove</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <aside className="card p-6 h-fit sticky top-24">
        <h2 className="font-display text-xl mb-4">Order Summary</h2>
        <div className="flex justify-between mb-2"><span>Subtotal</span><span>₹{subtotal}</span></div>
        <div className="flex justify-between text-sm text-muted mb-4"><span>Shipping & tax</span><span>Calculated at checkout</span></div>
        <Link to="/checkout" className="btn-primary w-full">Checkout</Link>
      </aside>
    </div>
  );
}
