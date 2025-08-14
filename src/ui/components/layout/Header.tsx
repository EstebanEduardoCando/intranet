import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import { useThemeStore } from '../../store/useTheme';

interface Props {
  onMenuClick: () => void;
  drawerWidth: number;
}

const Header: React.FC<Props> = ({ onMenuClick, drawerWidth }) => {
  const toggleTheme = useThemeStore((state) => state.toggle);
  return (
    <AppBar
      position="static"
      sx={{ width: { sm: `calc(100% - ${drawerWidth}px)` }, ml: { sm: `${drawerWidth}px` } }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          onClick={onMenuClick}
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Intranet
        </Typography>
        <IconButton color="inherit" onClick={toggleTheme}>
          <Brightness4Icon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
