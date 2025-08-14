import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const Footer: React.FC = () => {
  return (
    <Box component="footer" className="bg-gray-100 text-center py-4">
      <Typography variant="body2">© {new Date().getFullYear()} Intranet</Typography>
    </Box>
  );
};

export default Footer;
