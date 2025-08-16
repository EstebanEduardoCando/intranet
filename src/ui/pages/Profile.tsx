import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Container,
  Grid,
  Avatar,
  Divider,
  Chip,
  IconButton,
  useTheme,
  alpha,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  InputAdornment
} from '@mui/material';
import {
  Person as PersonIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  Photo as PhotoIcon
} from '@mui/icons-material';
import { useAuthStore } from '../store/useAuth';
import { SupabaseAuthService } from '../../infrastructure/supabase/SupabaseAuthService';

const Profile: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuthStore();
  const authService = new SupabaseAuthService();
  
  // Estados para edición de perfil
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Estados del formulario de perfil
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    department: '',
    position: ''
  });
  
  // Estados para cambio de contraseña
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError('');
    setSuccess('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: '',
      department: '',
      position: ''
    });
    setError('');
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      setError('El nombre es requerido');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Aquí implementarías la actualización del perfil
      // Por ahora simularemos la actualización
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess('Perfil actualizado exitosamente');
      setIsEditing(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al actualizar perfil');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordError('Todos los campos son requeridos');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('Las nuevas contraseñas no coinciden');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordError('La nueva contraseña debe tener al menos 8 caracteres');
      return;
    }

    setPasswordLoading(true);
    setPasswordError('');

    try {
      // Usar el servicio de Supabase para actualizar contraseña
      // Nota: Supabase requiere re-autenticación para cambios de contraseña
      await authService.updatePassword(passwordData.newPassword);
      
      setPasswordDialogOpen(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setSuccess('Contraseña actualizada exitosamente');
    } catch (error) {
      setPasswordError(error instanceof Error ? error.message : 'Error al cambiar contraseña');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
            Mi Perfil
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Administra tu información personal y configuración de cuenta
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Información Principal */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Información Personal
                  </Typography>
                  {!isEditing ? (
                    <Button
                      startIcon={<EditIcon />}
                      onClick={handleEdit}
                      variant="outlined"
                    >
                      Editar
                    </Button>
                  ) : (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        startIcon={<CancelIcon />}
                        onClick={handleCancel}
                        variant="outlined"
                        color="inherit"
                      >
                        Cancelar
                      </Button>
                      <Button
                        startIcon={<SaveIcon />}
                        onClick={handleSave}
                        variant="contained"
                        disabled={isLoading}
                      >
                        {isLoading ? <CircularProgress size={20} /> : 'Guardar'}
                      </Button>
                    </Box>
                  )}
                </Box>

                {error && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                  </Alert>
                )}

                {success && (
                  <Alert severity="success" sx={{ mb: 3 }}>
                    {success}
                  </Alert>
                )}

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Nombre completo"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      disabled={!isEditing || isLoading}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      disabled={!isEditing || isLoading}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Teléfono"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      disabled={!isEditing || isLoading}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Departamento"
                      value={formData.department}
                      onChange={(e) => handleInputChange('department', e.target.value)}
                      disabled={!isEditing || isLoading}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Cargo/Posición"
                      value={formData.position}
                      onChange={(e) => handleInputChange('position', e.target.value)}
                      disabled={!isEditing || isLoading}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Panel Lateral */}
          <Grid item xs={12} md={4}>
            {/* Avatar y datos básicos */}
            <Card sx={{ mb: 3 }}>
              <CardContent sx={{ p: 4, textAlign: 'center' }}>
                <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
                  <Avatar
                    sx={{
                      width: 100,
                      height: 100,
                      bgcolor: theme.palette.primary.main,
                      fontSize: '2rem',
                      fontWeight: 600
                    }}
                  >
                    {user?.name?.charAt(0) || 'U'}
                  </Avatar>
                  <IconButton
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      bgcolor: 'background.paper',
                      boxShadow: 2,
                      '&:hover': { bgcolor: 'background.paper' }
                    }}
                    size="small"
                  >
                    <PhotoIcon fontSize="small" />
                  </IconButton>
                </Box>
                
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                  {user?.name || 'Usuario'}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                  {user?.email || 'correo@ejemplo.com'}
                </Typography>
                
                <Chip 
                  label="Activo" 
                  color="success" 
                  size="small"
                  sx={{ mb: 2 }}
                />
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Miembro desde enero 2024
                </Typography>
              </CardContent>
            </Card>

            {/* Acciones de Seguridad */}
            <Card>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  Seguridad
                </Typography>
                
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<LockIcon />}
                  onClick={() => setPasswordDialogOpen(true)}
                  sx={{ mb: 2 }}
                >
                  Cambiar Contraseña
                </Button>
                
                <Box sx={{ p: 2, bgcolor: alpha(theme.palette.info.main, 0.1), borderRadius: 1 }}>
                  <Typography variant="caption" sx={{ color: 'info.main' }}>
                    <strong>Última actualización:</strong><br />
                    Hace 3 días
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Dialog para Cambiar Contraseña */}
        <Dialog
          open={passwordDialogOpen}
          onClose={() => setPasswordDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            Cambiar Contraseña
          </DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ mb: 3 }}>
              Ingresa tu contraseña actual y la nueva contraseña que deseas usar.
            </DialogContentText>
            
            {passwordError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {passwordError}
              </Alert>
            )}
            
            <TextField
              fullWidth
              label="Contraseña actual"
              type={showPasswords.current ? 'text' : 'password'}
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData(prev => ({
                ...prev,
                currentPassword: e.target.value
              }))}
              disabled={passwordLoading}
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPasswords(prev => ({
                        ...prev,
                        current: !prev.current
                      }))}
                      edge="end"
                    >
                      {showPasswords.current ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            
            <TextField
              fullWidth
              label="Nueva contraseña"
              type={showPasswords.new ? 'text' : 'password'}
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData(prev => ({
                ...prev,
                newPassword: e.target.value
              }))}
              disabled={passwordLoading}
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPasswords(prev => ({
                        ...prev,
                        new: !prev.new
                      }))}
                      edge="end"
                    >
                      {showPasswords.new ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            
            <TextField
              fullWidth
              label="Confirmar nueva contraseña"
              type={showPasswords.confirm ? 'text' : 'password'}
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData(prev => ({
                ...prev,
                confirmPassword: e.target.value
              }))}
              disabled={passwordLoading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPasswords(prev => ({
                        ...prev,
                        confirm: !prev.confirm
                      }))}
                      edge="end"
                    >
                      {showPasswords.confirm ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button 
              onClick={() => setPasswordDialogOpen(false)}
              disabled={passwordLoading}
            >
              Cancelar
            </Button>
            <Button
              onClick={handlePasswordChange}
              variant="contained"
              disabled={passwordLoading}
            >
              {passwordLoading ? <CircularProgress size={20} /> : 'Cambiar Contraseña'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default Profile;