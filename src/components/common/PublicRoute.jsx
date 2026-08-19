import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../pages/auth/hooks/useAuth';

/**
 * PublicRoute Component (Guest Route Guard)
 * 
 * Prevents logged-in users from seeing the Login / Register pages.
 * If user is already authenticated, redirects them directly to "/home".
 */
const PublicRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (user) {

    return <Navigate to="/home" replace />;
  }

  
  return <Outlet />;
};

export default PublicRoute;
