import { useAppSelector, useAppDispatch } from '../store';
import { logoutThunk } from '../features/auth/authSlice';
import { Link } from 'react-router-dom';
export default function Account() {
  const user = useAppSelector(s => s.auth.user);
  const dispatch = useAppDispatch();
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl mb-6">Hi, {user?.name}</h1>
      <div className="grid md:grid-cols-3 gap-4">
        <Link to="/orders" className="card p-6 hover:shadow-md">Orders</Link>
        <div className="card p-6">Addresses</div>
        <div className="card p-6">Profile</div>
      </div>
      <button onClick={() => dispatch(logoutThunk())} className="btn-outline mt-8">Sign out</button>
    </div>
  );
}
