import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import auth from '../features/auth/authSlice';
import cart from '../features/cart/cartSlice';
import wishlist from '../features/wishlist/wishlistSlice';
import ui from '../features/ui/uiSlice';

export const store = configureStore({ reducer: { auth, cart, wishlist, ui } });
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
