/**
 * =====================================================
 * PROTECTED ROUTE COMPONENT
 * =====================================================
 * 
 * Wraps routes that require authentication
 * Redirects to login if not authenticated
 * =====================================================
 */

import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const STORAGE_KEY = 'urbanmove_auth';

interface AuthData {
  isAuthenticated: boolean;
  userId: string;
  loginTime: number;
}

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const auth = localStorage.getItem(STORAGE_KEY);
      if (auth) {
        try {
          const authData: AuthData = JSON.parse(auth);
          setIsAuthenticated(authData.isAuthenticated);
        } catch (error) {
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  // Show nothing while checking
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="spinner mx-auto mb-4 border-green-600 border-t-transparent" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

