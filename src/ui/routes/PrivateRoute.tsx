import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuth';

interface Props {
  children: React.ReactElement;
}

const PrivateRoute: React.FC<Props> = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
