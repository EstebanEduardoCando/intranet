import React from 'react';
import Box from '@mui/material/Box';

interface Props {
  children: React.ReactNode;
}

const Body: React.FC<Props> = ({ children }) => (
  <Box component="main" className="flex-1 p-4">
    {children}
  </Box>
);

export default Body;
