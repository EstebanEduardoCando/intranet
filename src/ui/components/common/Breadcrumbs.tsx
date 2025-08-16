import React from 'react';
import {
  Breadcrumbs as MuiBreadcrumbs,
  Typography,
  Link,
  Box,
  useTheme,
  alpha
} from '@mui/material';
import {
  NavigateNext as NavigateNextIcon,
  Home as HomeIcon
} from '@mui/icons-material';
import { Link as RouterLink, useLocation } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  path?: string;
  icon?: React.ReactNode;
}

const Breadcrumbs: React.FC = () => {
  const theme = useTheme();
  const location = useLocation();

  // Mapping de rutas a breadcrumbs
  const routeToBreadcrumbs: Record<string, BreadcrumbItem[]> = {
    '/dashboard': [
      { label: 'Inicio', path: '/dashboard', icon: <HomeIcon fontSize="small" /> }
    ],
    '/profile': [
      { label: 'Inicio', path: '/dashboard', icon: <HomeIcon fontSize="small" /> },
      { label: 'Mi Perfil' }
    ],
    '/settings': [
      { label: 'Inicio', path: '/dashboard', icon: <HomeIcon fontSize="small" /> },
      { label: 'Configuración' }
    ],
    '/configuracion': [
      { label: 'Inicio', path: '/dashboard', icon: <HomeIcon fontSize="small" /> },
      { label: 'Configuración' }
    ],
    '/hr/employees': [
      { label: 'Inicio', path: '/dashboard', icon: <HomeIcon fontSize="small" /> },
      { label: 'Recursos Humanos' },
      { label: 'Gestión de Empleados' }
    ],
    '/hr/positions': [
      { label: 'Inicio', path: '/dashboard', icon: <HomeIcon fontSize="small" /> },
      { label: 'Recursos Humanos' },
      { label: 'Gestión de Cargos' }
    ],
    '/hr/recruitment': [
      { label: 'Inicio', path: '/dashboard', icon: <HomeIcon fontSize="small" /> },
      { label: 'Recursos Humanos' },
      { label: 'Reclutamiento' }
    ],
    '/admin/users': [
      { label: 'Inicio', path: '/dashboard', icon: <HomeIcon fontSize="small" /> },
      { label: 'Administración' },
      { label: 'Gestión de Usuarios' }
    ],
    '/admin/companies': [
      { label: 'Inicio', path: '/dashboard', icon: <HomeIcon fontSize="small" /> },
      { label: 'Administración' },
      { label: 'Gestión de Empresas' }
    ],
    '/admin/roles': [
      { label: 'Inicio', path: '/dashboard', icon: <HomeIcon fontSize="small" /> },
      { label: 'Administración' },
      { label: 'Gestión de Roles' }
    ],
    '/finance/accounting': [
      { label: 'Inicio', path: '/dashboard', icon: <HomeIcon fontSize="small" /> },
      { label: 'Finanzas' },
      { label: 'Contabilidad' }
    ],
    '/finance/budgets': [
      { label: 'Inicio', path: '/dashboard', icon: <HomeIcon fontSize="small" /> },
      { label: 'Finanzas' },
      { label: 'Presupuestos' }
    ]
  };

  const currentBreadcrumbs = routeToBreadcrumbs[location.pathname] || [
    { label: 'Inicio', path: '/dashboard', icon: <HomeIcon fontSize="small" /> },
    { label: 'Página no encontrada' }
  ];

  // No mostrar breadcrumbs en la página de inicio si solo tiene un elemento
  if (currentBreadcrumbs.length <= 1 && location.pathname === '/dashboard') {
    return null;
  }

  return (
    <Box
      sx={{
        py: 2,
        px: 3,
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
        bgcolor: alpha(theme.palette.background.paper, 0.8),
        backdropFilter: 'blur(8px)'
      }}
    >
      <MuiBreadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
        sx={{
          '& .MuiBreadcrumbs-separator': {
            color: theme.palette.text.secondary,
            mx: 1
          }
        }}
      >
        {currentBreadcrumbs.map((item, index) => {
          const isLast = index === currentBreadcrumbs.length - 1;
          
          if (isLast || !item.path) {
            return (
              <Typography
                key={index}
                color="text.primary"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  fontWeight: 500,
                  fontSize: '0.875rem'
                }}
              >
                {item.icon && item.icon}
                {item.label}
              </Typography>
            );
          }

          return (
            <Link
              key={index}
              component={RouterLink}
              to={item.path}
              underline="hover"
              color="text.secondary"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                fontSize: '0.875rem',
                '&:hover': {
                  color: theme.palette.primary.main
                }
              }}
            >
              {item.icon && item.icon}
              {item.label}
            </Link>
          );
        })}
      </MuiBreadcrumbs>
    </Box>
  );
};

export default Breadcrumbs;