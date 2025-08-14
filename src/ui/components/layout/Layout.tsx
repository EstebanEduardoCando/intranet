import React from 'react';
import { Box, CssBaseline, Toolbar, useTheme } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import Body from './Body';
import { Outlet } from 'react-router-dom';

const drawerWidth = 280;

const Layout: React.FC = () => {
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <CssBaseline />
      
      {/* Header */}
      <Header onMenuClick={handleDrawerToggle} drawerWidth={drawerWidth} />
      
      {/* Sidebar */}
      <Sidebar
        mobileOpen={mobileOpen}
        onDrawerToggle={handleDrawerToggle}
        drawerWidth={drawerWidth}
      />
      
      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: 0 },
          bgcolor: 'background.default',
          minHeight: '100vh'
        }}
      >
        {/* Spacer for fixed header */}
        <Toolbar />
        
        {/* Page Content */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          <Body>
            <Outlet />
          </Body>
        </Box>
        
        {/* Footer */}
        <Footer />
      </Box>
    </Box>
  );
};

export default Layout;
