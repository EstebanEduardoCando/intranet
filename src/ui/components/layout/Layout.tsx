import React from 'react';
import Box from '@mui/material/Box';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import Body from './Body';
import { Outlet } from 'react-router-dom';

const drawerWidth = 240;

const Layout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  return (
    <Box className="flex min-h-screen">
      <Sidebar
        mobileOpen={mobileOpen}
        onDrawerToggle={handleDrawerToggle}
        drawerWidth={drawerWidth}
      />
      <Box className="flex flex-1 flex-col">
        <Header onMenuClick={handleDrawerToggle} drawerWidth={drawerWidth} />
        <Body>
          <Outlet />
        </Body>
        <Footer />
      </Box>
    </Box>
  );
};

export default Layout;
