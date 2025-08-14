import React from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import { Link } from 'react-router-dom';

interface Props {
  mobileOpen: boolean;
  onDrawerToggle: () => void;
  drawerWidth: number;
}

const Sidebar: React.FC<Props> = ({ mobileOpen, onDrawerToggle, drawerWidth }) => {
  const drawer = (
    <Box onClick={onDrawerToggle} sx={{ textAlign: 'center' }} className="mt-10">
      <List>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/dashboard">
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/configuracion">
            <ListItemText primary="Configuración" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
