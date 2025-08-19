import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => (
  <Box className="p-4 text-center">
    <Typography variant="h4" gutterBottom>
      404 - No encontrado
    </Typography>
    <Button variant="contained" component={Link} to="/">
      Volver al inicio
    </Button>
  </Box>
);

export default NotFound;
