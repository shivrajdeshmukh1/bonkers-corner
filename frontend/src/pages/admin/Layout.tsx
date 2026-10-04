import { NavLink, Outlet } from 'react-router-dom';
import { useAppDispatch } from '../../store';
import { logoutThunk } from '../../features/auth/authSlice';
export default function AdminLayout() {
  const dispatch = useAppDispatch();
  const link = ({isActive}:{isActive:boolean}) => `block px-3 py-2 rounded ${isActive?'bg-ink text-bone':'hover:bg-black/5'}`;
  return (
    <div className="min-h-screen grid grid-cols-[220px_1fr]">
      <aside className="bg-bone border-r p-4 space-y-1">
        <h1 className="font-display text-xl mb-4">Bonkers Admin</h1>
        <NavLink to="/admin" end className={link}>Dashboard</NavLink>
        <NavLink to="/admin/products" className={link}>Products</NavLink>
        <NavLink to="/admin/orders" className={link}>Orders</NavLink>
        <NavLink to="/admin/users" className={link}>Users</NavLink>
        <button onClick={() => dispatch(logoutThunk())} className="mt-8 text-sm text-muted">Sign out</button>
      </aside>
      <main className="p-6 bg-white"><Outlet /></main>
    </div>
  );
}
