import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../store';
export default function RequireAdmin({ children }: { children: JSX.Element }) {
  const { user, ready } = useAppSelector(s => s.auth);
  if (!ready) return null;
  if (!user || user.role !== 'admin') return <Navigate to="/admin/login" replace />;
  return children;
}
