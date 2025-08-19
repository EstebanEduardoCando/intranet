import React, { useState, useEffect } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Collapse,
  Divider,
  useTheme,
  alpha,
  Badge,
  CircularProgress
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Settings as SettingsIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  Analytics as AnalyticsIcon,
  Assignment as AssignmentIcon,
  Event as EventIcon,
  Email as EmailIcon,
  Description as DescriptionIcon,
  Security as SecurityIcon,
  Help as HelpIcon,
  ExpandLess,
  ExpandMore,
  Circle as CircleIcon,
  FiberManualRecord as DotIcon,
  Apps as AppsIcon,
  Work as WorkIcon,
  AccountBalance as AccountBalanceIcon,
  School as SchoolIcon,
  Store as StoreIcon,
  LibraryBooks as LibraryBooksIcon,
  // Iconos adicionales del ModuleManagement
  Assessment as AssessmentIcon,
  MonetizationOn as MoneyIcon,
  Inventory as InventoryIcon,
  LocalShipping as ShippingIcon,
  Support as SupportIcon,
  FilePresent as FileIcon,
  Extension as ModuleIcon
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import { GetModules } from '../../../application/modules/GetModules';
import { SupabaseModuleRepository } from '../../../infrastructure/supabase/SupabaseModuleRepository';
import { Module, moduleCodeToPath } from '../../../domain/modules/Module';

interface Props {
  mobileOpen: boolean;
  onDrawerToggle: () => void;
  drawerWidth: number;
}

interface MenuItemType {
  id: string;
  title: string;
  icon: React.ReactNode;
  path?: string;
  badge?: number;
  children?: MenuItemType[];
}

/**
 * Convert Module entity to MenuItemType
 */
const convertModuleToMenuItem = (module: Module): MenuItemType => {
  // Solo los módulos sin hijos (hojas) deben tener path
  const hasChildren = module.children && module.children.length > 0;
  
  return {
    id: module.code,
    title: module.name,
    icon: getModuleIcon(module.icon || module.code),
    path: hasChildren ? undefined : (module.route || moduleCodeToPath(module.code)),
    children: module.children?.map(convertModuleToMenuItem)
  };
};

/**
 * Get appropriate icon for module based on icon name from database
 */
const getModuleIcon = (iconName: string): React.ReactNode => {
  // Mapeo de nombres de iconos de la BD a componentes React
  const iconMap: Record<string, React.ReactNode> = {
    // Iconos principales
    'DashboardIcon': <DashboardIcon />,
    'PeopleIcon': <PeopleIcon />,
    'BusinessIcon': <BusinessIcon />,
    'WorkIcon': <WorkIcon />,
    'SecurityIcon': <SecurityIcon />,
    'SettingsIcon': <SettingsIcon />,
    'AssessmentIcon': <AssessmentIcon />,
    'AssignmentIcon': <AssignmentIcon />,
    'StoreIcon': <StoreIcon />,
    'MoneyIcon': <MoneyIcon />,
    'InventoryIcon': <InventoryIcon />,
    'ShippingIcon': <ShippingIcon />,
    'AnalyticsIcon': <AnalyticsIcon />,
    'SupportIcon': <SupportIcon />,
    'EmailIcon': <EmailIcon />,
    'EventIcon': <EventIcon />,
    'FileIcon': <FileIcon />,
    'ModuleIcon': <ModuleIcon />,
    'AppsIcon': <AppsIcon />,
    'HelpIcon': <HelpIcon />,
    'AccountBalanceIcon': <AccountBalanceIcon />,
    'SchoolIcon': <SchoolIcon />,
    'LibraryBooksIcon': <LibraryBooksIcon />,
    
    // Fallbacks para códigos legacy
    'DASHBOARD': <DashboardIcon />,
    'ADMIN': <SettingsIcon />,
    'HR': <PeopleIcon />,
    'FINANCE': <AccountBalanceIcon />,
    'OPERATIONS': <WorkIcon />,
    'TRAINING': <SchoolIcon />,
    'APPS': <AppsIcon />,
    'REPORTS': <AnalyticsIcon />,
    'HELP': <HelpIcon />,
    
    // Default
    'default': <ModuleIcon />
  };

  return iconMap[iconName] || iconMap['default'];
};

const Sidebar: React.FC<Props> = ({ mobileOpen, onDrawerToggle, drawerWidth }) => {
  const theme = useTheme();
  const location = useLocation();
  const [openItems, setOpenItems] = useState<string[]>(['HR', 'ADMIN', 'FINANCE']);
  const [menuItems, setMenuItems] = useState<MenuItemType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Initialize repositories and use cases
  const moduleRepository = new SupabaseModuleRepository();
  const getModules = new GetModules(moduleRepository);

  // Load modules from database
  useEffect(() => {
    const loadModules = async () => {
      try {
        setIsLoading(true);
        const modules = await getModules.execute();
        const convertedMenuItems = modules.map(convertModuleToMenuItem);
        setMenuItems(convertedMenuItems);
      } catch (error) {
        console.error('Error loading modules:', error);
        // Fallback to empty array on error
        setMenuItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadModules();
  }, []);

  const handleToggle = (itemId: string) => {
    setOpenItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const isActive = (path?: string) => {
    if (!path) return false;
    return location.pathname === path;
  };

  const isParentActive = (children?: MenuItemType[]) => {
    if (!children) return false;
    return children.some(child => isActive(child.path));
  };

  const renderMenuItem = (item: MenuItemType, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = openItems.includes(item.id);
    const itemIsActive = isActive(item.path);
    const parentIsActive = isParentActive(item.children);

    const listItemButton = (
      <ListItemButton
        component={item.path ? Link : 'div'}
        to={item.path || ''}
        onClick={() => {
          if (hasChildren) {
            handleToggle(item.id);
          } else if (mobileOpen) {
            onDrawerToggle();
          }
        }}
        sx={{
          pl: 2 + level * 1.5,
          py: level === 0 ? 1 : 0.75,
          mb: level === 0 ? 0.5 : 0,
          mx: level === 0 ? 1 : 0.5,
          borderRadius: level === 0 ? 2 : 1,
          bgcolor: itemIsActive 
            ? alpha(theme.palette.primary.main, 0.12)
            : 'transparent',
          color: itemIsActive || parentIsActive 
            ? theme.palette.primary.main 
            : theme.palette.text.secondary,
          '&:hover': {
            bgcolor: alpha(theme.palette.primary.main, 0.08),
            color: theme.palette.primary.main,
          },
          '&.Mui-selected': {
            bgcolor: alpha(theme.palette.primary.main, 0.12),
          }
        }}
      >
        <ListItemIcon
          sx={{
            color: 'inherit',
            minWidth: level === 0 ? 40 : 32,
            mr: level === 0 ? 1 : 0.5,
          }}
        >
          {level > 0 ? <DotIcon sx={{ fontSize: 8 }} /> : item.icon}
        </ListItemIcon>
        <ListItemText
          primary={item.title}
          primaryTypographyProps={{
            variant: level === 0 ? 'body2' : 'caption',
            fontWeight: itemIsActive ? 600 : level === 0 ? 500 : 400,
            fontSize: level === 0 ? '0.875rem' : '0.75rem',
          }}
        />
        {item.badge && (
          <Badge 
            badgeContent={item.badge} 
            color="error" 
            sx={{ mr: hasChildren ? 1 : 0 }}
          />
        )}
        {hasChildren && (
          isExpanded ? <ExpandLess /> : <ExpandMore />
        )}
      </ListItemButton>
    );

    return (
      <React.Fragment key={item.id}>
        <ListItem disablePadding>
          {listItemButton}
        </ListItem>
        {hasChildren && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List disablePadding>
              {item.children!.map(child => renderMenuItem(child, level + 1))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo Section */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
          minHeight: 64,
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            bgcolor: theme.palette.primary.main,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mr: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: 'white',
              fontWeight: 'bold',
              fontSize: '1.25rem',
            }}
          >
            I
          </Typography>
        </Box>
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: theme.palette.text.primary,
              fontSize: '1.125rem',
            }}
          >
            Intranet
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: theme.palette.text.secondary,
              fontSize: '0.6875rem',
              lineHeight: 1,
            }}
          >
            Sistema Empresarial
          </Typography>
        </Box>
      </Box>

      {/* Navigation */}
      <Box sx={{ flex: 1, overflow: 'auto', py: 1 }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={24} />
          </Box>
        ) : (
          <List disablePadding>
            {menuItems.map(item => renderMenuItem(item))}
          </List>
        )}
      </Box>

      {/* Footer */}
      <Box
        sx={{
          p: 2,
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: theme.palette.text.secondary,
            display: 'block',
            textAlign: 'center',
          }}
        >
          © 2025 Intranet v2.0
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            bgcolor: theme.palette.background.default,
            borderRight: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
          },
        }}
      >
        {drawer}
      </Drawer>
      
      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            bgcolor: theme.palette.background.default,
            borderRight: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
