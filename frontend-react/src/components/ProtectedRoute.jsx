import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import api from '../api/axios';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if both user data and token exist in localStorage
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        
        if (!storedUser || !storedToken) {
          setIsAuthenticated(false);
          return;
        }

        // Verify with backend
        const response = await api.get('/api/v1/user');
        const user = response.data;
        
        // Update localStorage with fresh data
        localStorage.setItem('user', JSON.stringify(user));
        
        setUserRole(user.role);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Auth verification failed:', error);
        // If verification fails, clear localStorage and redirect to login
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  // Loading state
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-green-600 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role authorization
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    // Redirect to appropriate dashboard based on role
    if (userRole === 'admin') {
      return <Navigate to="/admin" replace />;
    } else if (userRole === 'farmer') {
      return <Navigate to="/farmer-dashboard" replace />;
    } else if (userRole === 'buyer') {
      return <Navigate to="/buyer-dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  // Authenticated and authorized
  return children;
};

export default ProtectedRoute;
