import axios from 'axios';
import { store } from '../store';
import { setAccessToken, logout } from '../features/auth/authSlice';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = store.getState().auth.accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let refreshing: Promise<string | null> | null = null;
api.interceptors.response.use(
  (r) => r,
  async (err) => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      refreshing ??= api.post('/auth/refresh').then(r => {
        const t = r.data.data.accessToken;
        store.dispatch(setAccessToken(t));
        return t;
      }).catch(() => { store.dispatch(logout()); return null; })
        .finally(() => { refreshing = null; });
      const token = await refreshing;
      if (token) { original.headers.Authorization = `Bearer ${token}`; return api(original); }
    }
    return Promise.reject(err);
  }
);
