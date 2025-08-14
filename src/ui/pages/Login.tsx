import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useAuthStore } from '../store/useAuth';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  const handleLogin = () => {
    login();
    navigate('/dashboard');
  };

  return (
    <Box className="p-4">
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      <Button variant="contained" onClick={handleLogin} className="mt-4">
        Entrar
      </Button>
    </Box>
  );
};

export default Login;
