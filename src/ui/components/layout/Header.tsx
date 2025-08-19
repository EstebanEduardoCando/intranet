import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  Box,
  Chip,
  Divider,
  ListItemIcon,
  ListItemText,
  Select,
  FormControl,
  useTheme,
  alpha,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  DialogContentText,
  Alert
} from '@mui/material';
import {
  Menu as MenuIcon,
  MenuOpen as MenuOpenIcon,
  Notifications as NotificationsIcon,
  Email as EmailIcon,
  Settings as SettingsIcon,
  Person as PersonIcon,
  ExitToApp as LogoutIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Language as LanguageIcon,
  Search as SearchIcon,
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon
} from '@mui/icons-material';
import { useThemeStore } from '../../store/useTheme';
import { useAuthStore } from '../../store/useAuth';
import { useNavigate } from 'react-router-dom';
import { getPersonDisplayName } from '../../../domain/user/Person';
import { useNotifications } from '../../contexts/NotificationContext';

interface Props {
  onMenuClick: () => void;
  onSidebarToggle: () => void;
  drawerWidth: number;
}

const Header: React.FC<Props> = ({ onMenuClick, onSidebarToggle, drawerWidth }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { mode, toggle: toggleTheme } = useThemeStore();
  const { user, logout } = useAuthStore();
  const { notificationHistory, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  
  // Helper functions for displaying user information
  const getUserDisplayName = () => {
    if (!user) return 'Usuario';
    return getPersonDisplayName(user.person);
  };
  
  const getUserInitial = () => {
    if (!user) return 'U';
    return user.person.firstName.charAt(0).toUpperCase();
  };
  
  const [profileAnchorEl, setProfileAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);
  const [language, setLanguage] = useState('es');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutSuccess, setLogoutSuccess] = useState(false);

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleNotificationClick = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileAnchorEl(null);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
    // Mark all as read when closing notification menu
    if (unreadCount > 0) {
      markAllAsRead();
    }
  };

  const formatNotificationTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Ahora mismo';
    if (minutes < 60) return `hace ${minutes} min`;
    if (hours < 24) return `hace ${hours} h`;
    return `hace ${days} días`;
  };

  const handleLogout = () => {
    setLogoutDialogOpen(true);
    handleProfileClose();
  };

  const confirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      setLogoutSuccess(true);
      setTimeout(() => {
        setLogoutDialogOpen(false);
        setIsLoggingOut(false);
        setLogoutSuccess(false);
      }, 1500);
    } catch (error) {
      setIsLoggingOut(false);
      // El error se maneja en el store de auth
    }
  };

  const cancelLogout = () => {
    setLogoutDialogOpen(false);
    setIsLoggingOut(false);
    setLogoutSuccess(false);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <AppBar
      position="fixed"
      elevation={1}
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
        bgcolor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
        backdropFilter: 'blur(8px)',
        zIndex: theme.zIndex.appBar
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 3 } }}>
        {/* Left Section - Menu & Search */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* Mobile menu button */}
          <IconButton
            color="inherit"
            edge="start"
            onClick={onMenuClick}
            sx={{ 
              mr: 2, 
              display: { sm: 'none' },
              '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.1) }
            }}
          >
            <MenuIcon />
          </IconButton>
          
          {/* Desktop sidebar toggle button */}
          <IconButton
            color="inherit"
            onClick={onSidebarToggle}
            sx={{ 
              mr: 2,
              display: { xs: 'none', sm: 'flex' },
              '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.1) }
            }}
          >
            {drawerWidth > 0 ? <MenuOpenIcon /> : <MenuIcon />}
          </IconButton>
          
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
            <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Buscar en el sistema...
            </Typography>
          </Box>
        </Box>

        {/* Right Section - Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Language Selector */}
          <FormControl size="small" sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              sx={{
                minWidth: 80,
                '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                '& .MuiSelect-select': { py: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }
              }}
            >
              <MenuItem value="es">
                <LanguageIcon fontSize="small" sx={{ mr: 0.5 }} />
                ES
              </MenuItem>
              <MenuItem value="en">
                <LanguageIcon fontSize="small" sx={{ mr: 0.5 }} />
                EN
              </MenuItem>
            </Select>
          </FormControl>

          {/* Fullscreen Toggle */}
          <IconButton
            onClick={toggleFullscreen}
            sx={{
              color: 'text.secondary',
              '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.1) }
            }}
          >
            {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
          </IconButton>

          {/* Theme Toggle */}
          <IconButton
            onClick={toggleTheme}
            sx={{
              color: 'text.secondary',
              '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.1) }
            }}
          >
            {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>

          {/* Notifications */}
          <IconButton
            onClick={handleNotificationClick}
            sx={{
              color: 'text.secondary',
              '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.1) }
            }}
          >
            <Badge 
              badgeContent={unreadCount > 0 ? unreadCount : null} 
              color="error"
              max={99}
            >
              <NotificationsIcon />
            </Badge>
          </IconButton>

          {/* Messages */}
          <IconButton
            sx={{
              color: 'text.secondary',
              '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.1) }
            }}
          >
            <Badge badgeContent={5} color="primary">
              <EmailIcon />
            </Badge>
          </IconButton>

          {/* User Profile */}
          <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
            <IconButton onClick={handleProfileClick} sx={{ p: 0 }}>
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: theme.palette.primary.main,
                  fontSize: '0.875rem',
                  fontWeight: 600
                }}
              >
                {getUserInitial()}
              </Avatar>
            </IconButton>
            <Box sx={{ ml: 1, display: { xs: 'none', sm: 'block' } }}>
              <Typography variant="subtitle2" sx={{ lineHeight: 1.2 }}>
                {getUserDisplayName()}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                En línea
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Profile Menu */}
        <Menu
          anchorEl={profileAnchorEl}
          open={Boolean(profileAnchorEl)}
          onClose={handleProfileClose}
          PaperProps={{
            sx: {
              mt: 1,
              minWidth: 200,
              boxShadow: theme.shadows[8]
            }
          }}
        >
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="subtitle2">{getUserDisplayName()}</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {user?.email || 'correo@ejemplo.com'}
            </Typography>
            {user?.roles && user.roles.length > 0 ? (
              <Chip 
                label={user.roles[0].name} 
                size="small" 
                color="primary" 
                sx={{ mt: 0.5 }} 
              />
            ) : (
              <Chip 
                label="Usuario" 
                size="small" 
                color="default" 
                sx={{ mt: 0.5 }} 
              />
            )}
          </Box>
          <Divider />
          <MenuItem onClick={() => { handleProfileClose(); navigate('/profile'); }}>
            <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
            <ListItemText>Mi Perfil</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleProfileClose}>
            <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>
            <ListItemText>Configuración</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
            <ListItemIcon sx={{ color: 'inherit' }}>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Cerrar Sesión</ListItemText>
          </MenuItem>
        </Menu>

        {/* Notifications Menu */}
        <Menu
          anchorEl={notificationAnchorEl}
          open={Boolean(notificationAnchorEl)}
          onClose={handleNotificationClose}
          PaperProps={{
            sx: {
              mt: 1,
              maxWidth: 380,
              maxHeight: 500,
              boxShadow: theme.shadows[8]
            }
          }}
        >
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="subtitle2">Notificaciones</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {unreadCount > 0 
                ? `Tienes ${unreadCount} notificación${unreadCount !== 1 ? 'es' : ''} nueva${unreadCount !== 1 ? 's' : ''}`
                : 'No hay notificaciones nuevas'
              }
            </Typography>
          </Box>
          <Divider />
          {notificationHistory.length === 0 ? (
            <Box sx={{ px: 2, py: 3, textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                No hay notificaciones
              </Typography>
            </Box>
          ) : (
            notificationHistory.slice(0, 5).map((notification) => (
              <MenuItem 
                key={notification.id}
                onClick={() => markAsRead(notification.id)}
                sx={{ 
                  borderLeft: !notification.isRead ? `3px solid ${theme.palette.primary.main}` : 'none',
                  bgcolor: !notification.isRead ? alpha(theme.palette.primary.main, 0.05) : 'transparent',
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.1)
                  }
                }}
              >
                <Box sx={{ width: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: !notification.isRead ? 600 : 400,
                        flex: 1
                      }}
                    >
                      {notification.title || 'Notificación'}
                    </Typography>
                    {!notification.isRead && (
                      <Box 
                        sx={{ 
                          width: 8, 
                          height: 8, 
                          borderRadius: '50%', 
                          bgcolor: theme.palette.primary.main 
                        }} 
                      />
                    )}
                  </Box>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: 'text.secondary',
                      display: 'block',
                      mb: 0.5
                    }}
                  >
                    {notification.message}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {notification.timestamp && formatNotificationTime(notification.timestamp)}
                  </Typography>
                </Box>
              </MenuItem>
            ))
          )}
          {notificationHistory.length > 5 && (
            <>
              <Divider />
              <MenuItem sx={{ justifyContent: 'center' }}>
                <Typography variant="caption" sx={{ color: 'primary.main' }}>
                  Ver todas las notificaciones
                </Typography>
              </MenuItem>
            </>
          )}
        </Menu>

        {/* Logout Confirmation Dialog */}
        <Dialog
          open={logoutDialogOpen}
          onClose={!isLoggingOut ? cancelLogout : undefined}
          PaperProps={{
            sx: {
              borderRadius: 2,
              minWidth: 400
            }
          }}
        >
          <DialogTitle sx={{ pb: 1 }}>
            {logoutSuccess ? '¡Hasta pronto!' : '¿Cerrar sesión?'}
          </DialogTitle>
          <DialogContent>
            {logoutSuccess ? (
              <Alert severity="success" sx={{ mt: 1 }}>
                Sesión cerrada exitosamente. Redirigiendo...
              </Alert>
            ) : (
              <DialogContentText>
                ¿Estás seguro que deseas cerrar tu sesión? Tendrás que volver a iniciar sesión para acceder al sistema.
              </DialogContentText>
            )}
          </DialogContent>
          {!logoutSuccess && (
            <DialogActions sx={{ p: 3, pt: 1 }}>
              <Button 
                onClick={cancelLogout}
                disabled={isLoggingOut}
                color="inherit"
              >
                Cancelar
              </Button>
              <Button
                onClick={confirmLogout}
                disabled={isLoggingOut}
                variant="contained"
                color="error"
                sx={{ ml: 1 }}
              >
                {isLoggingOut ? 'Cerrando sesión...' : 'Cerrar sesión'}
              </Button>
            </DialogActions>
          )}
        </Dialog>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
