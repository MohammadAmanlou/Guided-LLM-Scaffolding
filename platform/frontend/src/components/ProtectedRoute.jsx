import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="text-center mt-10">در حال بارگذاری...</div>;
  }

  return user ? (
    children
  ) : (
    <Navigate to="/login" replace state={{ from: location }} />
  );
}
