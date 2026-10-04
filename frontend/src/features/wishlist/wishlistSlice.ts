import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
type State = { ids: string[] };
const KEY = 'bc_wishlist';
const load = (): State => { try { return JSON.parse(localStorage.getItem(KEY) || '{"ids":[]}'); } catch { return { ids: [] }; } };
const save = (s: State) => localStorage.setItem(KEY, JSON.stringify(s));
const slice = createSlice({
  name: 'wishlist',
  initialState: load(),
  reducers: {
    toggle(s, a: PayloadAction<string>) {
      const i = s.ids.indexOf(a.payload);
      if (i >= 0) s.ids.splice(i, 1); else s.ids.push(a.payload);
      save(s);
    },
  },
});
export const { toggle } = slice.actions;
export default slice.reducer;
