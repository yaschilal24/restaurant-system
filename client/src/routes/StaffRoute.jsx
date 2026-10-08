import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function StaffRoute() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user || !['staff', 'admin'].includes(user.role)) return <Navigate to="/" replace />;
  return <Outlet />;
}