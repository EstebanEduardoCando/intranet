import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { useThemeStore } from './store/useTheme';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Configuracion from './pages/Configuracion';
import Profile from './pages/Profile';
import UserManagement from './pages/management/UserManagement';
import CompanyManagement from './pages/management/CompanyManagement';
import PositionManagement from './pages/management/PositionManagement';
import RoleManagement from './pages/management/RoleManagement';
import ModuleManagement from './pages/management/ModuleManagement';
import AuditHistory from './pages/management/AuditHistory';
import TestNotifications from './pages/TestNotifications';
import PlaceholderPage from './pages/PlaceholderPage';
import LandingRegistro from './pages/LandingRegistro';
import ResetPassword from './pages/ResetPassword';
import NewPassword from './pages/NewPassword';
import Error404 from './pages/Error404';
import NotFound from './pages/NotFound';
import PrivateRoute from './routes/PrivateRoute';
import { NotificationProvider } from './contexts/NotificationContext';
import NotificationContainer from './components/common/NotificationContainer';

const App: React.FC = () => {
  const mode = useThemeStore((state) => state.mode);
  
  const theme = React.useMemo(() => 
    createTheme({
      palette: {
        mode,
        primary: {
          main: '#1976d2',
          light: '#42a5f5',
          dark: '#1565c0',
        },
        secondary: {
          main: '#dc004e',
          light: '#ff5983',
          dark: '#9a0036',
        },
        background: {
          default: mode === 'light' ? '#f8fafc' : '#121212',
          paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
        },
        text: {
          primary: mode === 'light' ? '#1f2937' : '#ffffff',
          secondary: mode === 'light' ? '#6b7280' : '#b3b3b3',
        },
      },
      typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h4: {
          fontWeight: 600,
        },
        h6: {
          fontWeight: 600,
        },
        subtitle1: {
          fontWeight: 500,
        },
        subtitle2: {
          fontWeight: 500,
        },
      },
      shape: {
        borderRadius: 8,
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              textTransform: 'none',
              fontWeight: 500,
            },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              boxShadow: mode === 'light' 
                ? '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                : '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              boxShadow: mode === 'light' 
                ? '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                : '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
            },
          },
        },
      },
    }), 
  [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NotificationProvider>
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/new-password" element={<NewPassword />} />
          <Route path="/landing-registro" element={<LandingRegistro />} />
          <Route element={<Layout />}>
            {/* Main Routes */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <PrivateRoute>
                  <Configuracion />
                </PrivateRoute>
              }
            />
            <Route
              path="/configuracion"
              element={
                <PrivateRoute>
                  <Configuracion />
                </PrivateRoute>
              }
            />
            
            {/* Administration Module Routes */}
            <Route
              path="/administration/users"
              element={
                <PrivateRoute>
                  <UserManagement />
                </PrivateRoute>
              }
            />
            
            {/* Sprint 7 - Catalog Management Routes */}
            <Route
              path="/administration/companies"
              element={
                <PrivateRoute>
                  <CompanyManagement />
                </PrivateRoute>
              }
            />
            <Route
              path="/administration/positions"
              element={
                <PrivateRoute>
                  <PositionManagement />
                </PrivateRoute>
              }
            />
            <Route
              path="/administration/roles"
              element={
                <PrivateRoute>
                  <RoleManagement />
                </PrivateRoute>
              }
            />
            <Route
              path="/administration/modules"
              element={
                <PrivateRoute>
                  <ModuleManagement />
                </PrivateRoute>
              }
            />
            <Route
              path="/administration/audit"
              element={
                <PrivateRoute>
                  <AuditHistory />
                </PrivateRoute>
              }
            />
            <Route
              path="/test/notifications"
              element={
                <PrivateRoute>
                  <TestNotifications />
                </PrivateRoute>
              }
            />
            
            {/* Legacy HR Routes */}
            <Route
              path="/hr/positions"
              element={
                <PrivateRoute>
                  <PositionManagement />
                </PrivateRoute>
              }
            />
            <Route
              path="/hr/recruitment"
              element={
                <PrivateRoute>
                  <PlaceholderPage moduleName="Reclutamiento" moduleDescription="Procesos de contratación y selección de personal" />
                </PrivateRoute>
              }
            />
            
            {/* Legacy Admin Routes */}
            <Route
              path="/admin/users"
              element={
                <PrivateRoute>
                  <UserManagement />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/companies"
              element={
                <PrivateRoute>
                  <CompanyManagement />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/roles"
              element={
                <PrivateRoute>
                  <RoleManagement />
                </PrivateRoute>
              }
            />
            
            {/* Finance Module Routes */}
            <Route
              path="/finance/accounting"
              element={
                <PrivateRoute>
                  <PlaceholderPage moduleName="Contabilidad" moduleDescription="Gestión contable y libros financieros" />
                </PrivateRoute>
              }
            />
            <Route
              path="/finance/budgets"
              element={
                <PrivateRoute>
                  <PlaceholderPage moduleName="Presupuestos" moduleDescription="Planificación y control presupuestario" />
                </PrivateRoute>
              }
            />
          </Route>
          <Route path="/error404" element={<Error404 />} />
          <Route path="/notFound" element={<NotFound />} />
          <Route path="*" element={<Error404 />} />
        </Routes>
        <NotificationContainer />
      </BrowserRouter>
    </NotificationProvider>
    </ThemeProvider>
  );
};

export default App;
