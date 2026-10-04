import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type CartLine = {
  productId: string; slug: string; name: string; image: string;
  price: number; size?: string; color?: string; qty: number; stock: number;
};
type State = { items: CartLine[] };
const KEY = 'bc_cart';
const load = (): State => { try { return JSON.parse(localStorage.getItem(KEY) || '{"items":[]}'); } catch { return { items: [] }; } };
const save = (s: State) => localStorage.setItem(KEY, JSON.stringify(s));

const slice = createSlice({
  name: 'cart',
  initialState: load(),
  reducers: {
    addItem(s, a: PayloadAction<CartLine>) {
      const k = (x: CartLine) => `${x.productId}|${x.size}|${x.color}`;
      const existing = s.items.find(i => k(i) === k(a.payload));
      if (existing) existing.qty = Math.min(existing.qty + a.payload.qty, a.payload.stock);
      else s.items.push(a.payload);
      save(s);
    },
    updateQty(s, a: PayloadAction<{ index: number; qty: number }>) {
      const it = s.items[a.payload.index];
      if (it) it.qty = Math.max(1, Math.min(a.payload.qty, it.stock));
      save(s);
    },
    removeItem(s, a: PayloadAction<number>) { s.items.splice(a.payload, 1); save(s); },
    clearCart(s) { s.items = []; save(s); },
  },
});
export const { addItem, updateQty, removeItem, clearCart } = slice.actions;
export default slice.reducer;
