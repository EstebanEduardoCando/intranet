import React from 'react';
import { Box, Container, useTheme, alpha } from '@mui/material';

interface Props {
  children: React.ReactNode;
}

const Body: React.FC<Props> = ({ children }) => {
  const theme = useTheme();
  
  return (
    <Box
      component="main"
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        bgcolor: alpha(theme.palette.background.default, 0.8),
        minHeight: 0,
        overflow: 'auto'
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          py: 3,
          px: { xs: 2, sm: 3 },
          maxWidth: 'none !important'
        }}
      >
        {children}
      </Container>
    </Box>
  );
};

export default Body;
