import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

const Home: React.FC = () => (
  <Box className="p-4">
    <Typography variant="h4" gutterBottom>
      Home Publico
    </Typography>
    <Button variant="contained" component={Link} to="/login">
      Ir a Login
    </Button>
  </Box>
);

export default Home;
