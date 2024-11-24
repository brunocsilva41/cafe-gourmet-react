// src/components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { isAdmin } from '../utils/auth';

const PrivateRoute = ({ children, adminOnly }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && !isAdmin(user)) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;