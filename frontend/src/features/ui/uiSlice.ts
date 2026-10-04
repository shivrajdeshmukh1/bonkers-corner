import { createSlice } from '@reduxjs/toolkit';
const slice = createSlice({
  name: 'ui',
  initialState: { cartOpen: false },
  reducers: {
    openCart: s => { s.cartOpen = true; },
    closeCart: s => { s.cartOpen = false; },
    toggleCart: s => { s.cartOpen = !s.cartOpen; },
  },
});
export const { openCart, closeCart, toggleCart } = slice.actions;
export default slice.reducer;
