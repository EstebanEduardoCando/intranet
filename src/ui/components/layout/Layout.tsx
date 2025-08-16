import React from 'react';
import { Box, CssBaseline, Toolbar, useTheme } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import Body from './Body';
import Breadcrumbs from '../common/Breadcrumbs';
import { Outlet } from 'react-router-dom';

const drawerWidth = 280;

const Layout: React.FC = () => {
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleSidebarToggle = () => setSidebarOpen(!sidebarOpen);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <CssBaseline />
      
      {/* Header */}
      <Header 
        onMenuClick={handleDrawerToggle} 
        onSidebarToggle={handleSidebarToggle}
        drawerWidth={sidebarOpen ? drawerWidth : 0} 
      />
      
      {/* Sidebar */}
      {sidebarOpen && (
        <Sidebar
          mobileOpen={mobileOpen}
          onDrawerToggle={handleDrawerToggle}
          drawerWidth={drawerWidth}
        />
      )}
      
      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          width: { 
            xs: '100%',
            sm: sidebarOpen ? `calc(100% - ${drawerWidth}px)` : '100%'
          },
          ml: { sm: 0 },
          bgcolor: 'background.default',
          minHeight: '100vh',
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          })
        }}
      >
        {/* Spacer for fixed header */}
        <Toolbar />
        
        {/* Breadcrumbs */}
        <Breadcrumbs />
        
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
