import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import { useAuthStore } from '../store/useAuth';

interface Props {
  children: React.ReactElement;
}

const PrivateRoute: React.FC<Props> = ({ children }) => {
  const { isAuthenticated, isLoading, getCurrentUser } = useAuthStore();
  
  useEffect(() => {
    // Check if user is authenticated on mount
    if (!isAuthenticated && !isLoading) {
      getCurrentUser();
    }
  }, [isAuthenticated, isLoading, getCurrentUser]);
  
  if (isLoading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
