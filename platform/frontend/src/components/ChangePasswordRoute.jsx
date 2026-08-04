import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ChangePasswordRoute({ children }) {
  const tempUser = localStorage.getItem('temp_user');

  return tempUser ? children : <Navigate to="/login" replace />;
}
