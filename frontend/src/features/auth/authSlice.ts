import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { api } from '../../lib/api';

type User = { id: string; name: string; email: string; role: 'customer'|'admin' };
type State = { user: User | null; accessToken: string | null; ready: boolean };
const initialState: State = { user: null, accessToken: null, ready: false };

export const bootstrapAuth = createAsyncThunk('auth/bootstrap', async () => {
  try {
    const r = await api.post('/auth/refresh');
    const token = r.data.data.accessToken;
    const me = await api.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } });
    return { accessToken: token, user: me.data.data.user };
  } catch { return { accessToken: null, user: null }; }
});

export const login = createAsyncThunk('auth/login', async (body: {email:string;password:string}) => {
  const r = await api.post('/auth/login', body);
  return r.data.data as { accessToken: string; user: User };
});
export const register = createAsyncThunk('auth/register', async (body: {name:string;email:string;password:string}) => {
  const r = await api.post('/auth/register', body);
  return r.data.data as { accessToken: string; user: User };
});
export const logoutThunk = createAsyncThunk('auth/logoutThunk', async () => {
  await api.post('/auth/logout');
});

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAccessToken(s, a: PayloadAction<string|null>) { s.accessToken = a.payload; },
    logout(s) { s.user = null; s.accessToken = null; },
  },
  extraReducers: b => {
    b.addCase(bootstrapAuth.fulfilled, (s, a) => { s.user = a.payload.user; s.accessToken = a.payload.accessToken; s.ready = true; });
    b.addCase(bootstrapAuth.rejected, (s) => { s.ready = true; });
    b.addCase(login.fulfilled, (s, a) => { s.user = a.payload.user; s.accessToken = a.payload.accessToken; });
    b.addCase(register.fulfilled, (s, a) => { s.user = a.payload.user; s.accessToken = a.payload.accessToken; });
    b.addCase(logoutThunk.fulfilled, (s) => { s.user = null; s.accessToken = null; });
  },
});
export const { setAccessToken, logout } = slice.actions;
export default slice.reducer;
