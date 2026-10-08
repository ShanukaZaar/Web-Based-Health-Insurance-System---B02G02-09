import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, isAdmin, user } = useAuth();
  const location = useLocation();
  const { showToast } = useToast();

  useEffect(() => {
    if (isAuthenticated && requiredRole === 'ADMIN' && !isAdmin) {
      showToast(
        'Access Denied: Administrator privileges are required to access this area.',
        'error',
        'Unauthorized'
      );
    }
  }, [isAuthenticated, requiredRole, isAdmin, showToast]);

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole === 'ADMIN' && !isAdmin) {
    // A normal USER must NOT be able to access Admin Dashboard pages -> redirect to User Dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
