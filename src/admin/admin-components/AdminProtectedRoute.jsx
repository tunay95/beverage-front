import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function AdminProtectedRoute() {
  const { isAuthenticated, userSummary, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  // Check if user has Admin role
  if (userSummary && userSummary.role !== 'Admin') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
