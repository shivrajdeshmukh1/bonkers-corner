import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../store';
export default function RequireAuth({ children }: { children: JSX.Element }) {
  const { user, ready } = useAppSelector(s => s.auth);
  const loc = useLocation();
  if (!ready) return null;
  if (!user) return <Navigate to="/login" state={{ from: loc.pathname }} replace />;
  return children;
}
