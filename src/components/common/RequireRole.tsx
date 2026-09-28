import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../auth/AuthProvider';

export function RequireRole({ roles }: { roles: string[] }) {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!user || !roles.includes(user.role)) {
    return <Navigate to="/forbidden" replace />;
  }

  return <Outlet />;
}
