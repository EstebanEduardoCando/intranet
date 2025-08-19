import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Alert,
  Divider
} from '@mui/material';
import {
  NotificationAdd as NotificationIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { useNotifications } from '../contexts/NotificationContext';

const TestNotifications: React.FC = () => {
  const { 
    showSuccess, 
    showError, 
    showWarning, 
    showInfo,
    notificationHistory,
    unreadCount,
    loadPersistentNotifications
  } = useNotifications();

  const handleTestNotifications = () => {
    // Notificaciones temporales (no persistentes)
    showSuccess('Esta es una notificación de éxito temporal', 'Éxito', 3000, false);
    showError('Esta es una notificación de error temporal', 'Error', 3000, false);
    showWarning('Esta es una notificación de advertencia temporal', 'Advertencia', 3000, false);
    showInfo('Esta es una notificación de información temporal', 'Información', 3000, false);
  };

  const handleTestPersistentNotifications = () => {
    // Notificaciones persistentes (se guardan en BD)
    showSuccess('Notificación persistente de éxito - sobrevive al logout', 'Éxito Persistente', 5000, true);
    showError('Notificación persistente de error - se mantiene en BD', 'Error Persistente', 5000, true);
    showWarning('Notificación persistente de advertencia - permanente', 'Advertencia Persistente', 5000, true);
    showInfo('Notificación persistente de información - guardada', 'Info Persistente', 5000, true);
  };

  const handleReloadPersistent = () => {
    loadPersistentNotifications();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <NotificationIcon color="primary" />
        Pruebas de Notificaciones
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Página de pruebas para verificar el funcionamiento de las notificaciones temporales y persistentes
      </Typography>

      <Grid container spacing={3}>
        {/* Sección de pruebas temporales */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SuccessIcon color="success" />
                Notificaciones Temporales
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Estas notificaciones solo existen en memoria y desaparecen al recargar la página
              </Typography>
              
              <Button
                variant="contained"
                onClick={handleTestNotifications}
                fullWidth
                sx={{ mb: 2 }}
              >
                Probar Notificaciones Temporales
              </Button>

              <Alert severity="info" sx={{ mt: 2 }}>
                Las notificaciones temporales aparecen en la esquina superior derecha y se auto-eliminan después de 3 segundos
              </Alert>
            </CardContent>
          </Card>
        </Grid>

        {/* Sección de pruebas persistentes */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <InfoIcon color="info" />
                Notificaciones Persistentes
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Estas notificaciones se guardan en la base de datos y persisten entre sesiones
              </Typography>
              
              <Button
                variant="contained"
                color="secondary"
                onClick={handleTestPersistentNotifications}
                fullWidth
                sx={{ mb: 2 }}
              >
                Probar Notificaciones Persistentes
              </Button>

              <Button
                variant="outlined"
                onClick={handleReloadPersistent}
                fullWidth
                sx={{ mb: 2 }}
              >
                Recargar Notificaciones Persistentes
              </Button>

              <Alert severity="warning" sx={{ mt: 2 }}>
                Las notificaciones persistentes se guardan en la BD y aparecen en el historial del header. 
                Haz logout/login para verificar que persisten.
              </Alert>
            </CardContent>
          </Card>
        </Grid>

        {/* Estado actual */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Estado Actual de Notificaciones
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" color="text.secondary">
                    Notificaciones no leídas:
                  </Typography>
                  <Typography variant="h4" color="primary">
                    {unreadCount}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" color="text.secondary">
                    Total en historial:
                  </Typography>
                  <Typography variant="h4" color="info.main">
                    {notificationHistory.length}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" color="text.secondary">
                    Persistentes en historial:
                  </Typography>
                  <Typography variant="h4" color="warning.main">
                    {notificationHistory.filter(n => n.isPersistent).length}
                  </Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle2" gutterBottom>
                Últimas 5 notificaciones:
              </Typography>
              
              {notificationHistory.slice(0, 5).map((notification, index) => (
                <Box key={notification.id} sx={{ mb: 1, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="body2">
                    <strong>{notification.title}</strong> - {notification.message}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {notification.type} | {notification.isPersistent ? 'Persistente' : 'Temporal'} | 
                    {notification.timestamp?.toLocaleTimeString()}
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Instrucciones de prueba */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            📋 Instrucciones para Probar Notificaciones Persistentes
          </Typography>
          
          <Box component="ol" sx={{ pl: 2 }}>
            <li>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Haz clic en "Probar Notificaciones Persistentes" para crear notificaciones que se guardan en BD
              </Typography>
            </li>
            <li>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Observa que aparecen en el header (icono de campana) y que el contador aumenta
              </Typography>
            </li>
            <li>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Haz logout desde el header (menú de usuario)
              </Typography>
            </li>
            <li>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Vuelve a hacer login con las mismas credenciales
              </Typography>
            </li>
            <li>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Verifica que las notificaciones persistentes siguen apareciendo en el header
              </Typography>
            </li>
            <li>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Abre la consola del navegador (F12) para ver logs de las operaciones de BD
              </Typography>
            </li>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default TestNotifications;