import React, { useState, useEffect } from 'react';
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
  useTheme,
  alpha,
  LinearProgress,
  InputAdornment,
  IconButton
} from '@mui/material';
import {
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../../infrastructure/supabase/supabaseClient';

const NewPassword: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  
  useEffect(() => {
    // Verificar si hay un token válido en la URL
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');
    
    if (accessToken && refreshToken) {
      setTokenValid(true);
    } else {
      setTokenValid(false);
    }
  }, [searchParams]);
  
  const getPasswordStrength = (password: string): number => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    return strength;
  };
  
  const getPasswordStrengthColor = (strength: number): string => {
    if (strength < 50) return theme.palette.error.main;
    if (strength < 75) return theme.palette.warning.main;
    return theme.palette.success.main;
  };
  
  const getPasswordStrengthText = (strength: number): string => {
    if (strength < 25) return 'Muy débil';
    if (strength < 50) return 'Débil';
    if (strength < 75) return 'Moderada';
    return 'Fuerte';
  };

  const validatePassword = (): string | null => {
    if (!password) return 'La contraseña es requerida';
    if (password.length < 8) return 'La contraseña debe tener al menos 8 caracteres';
    if (!confirmPassword) return 'Confirma tu contraseña';
    if (password !== confirmPassword) return 'Las contraseñas no coinciden';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validatePassword();
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/login', { 
          state: { message: 'Contraseña actualizada exitosamente. Ya puedes iniciar sesión.' }
        });
      }, 2000);
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al actualizar contraseña');
    } finally {
      setIsLoading(false);
    }
  };

  if (tokenValid === false) {
    return (
      <Container maxWidth="sm">
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            py: 4
          }}
        >
          <Card
            sx={{
              width: '100%',
              maxWidth: 500,
              boxShadow: theme.shadows[8],
              borderRadius: 3
            }}
          >
            <CardContent sx={{ p: 6, textAlign: 'center' }}>
              <ErrorIcon
                sx={{
                  fontSize: 64,
                  color: 'error.main',
                  mb: 3
                }}
              />
              
              <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
                Enlace Inválido
              </Typography>
              
              <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
                El enlace de recuperación es inválido o ha expirado. 
                Solicita un nuevo enlace de recuperación.
              </Typography>
              
              <Button
                variant="contained"
                onClick={() => navigate('/reset-password')}
                fullWidth
              >
                Solicitar nuevo enlace
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Container>
    );
  }

  if (success) {
    return (
      <Container maxWidth="sm">
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            py: 4
          }}
        >
          <Card
            sx={{
              width: '100%',
              maxWidth: 500,
              boxShadow: theme.shadows[8],
              borderRadius: 3
            }}
          >
            <CardContent sx={{ p: 6, textAlign: 'center' }}>
              <CheckCircleIcon
                sx={{
                  fontSize: 64,
                  color: 'success.main',
                  mb: 3
                }}
              />
              
              <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
                ¡Contraseña Actualizada!
              </Typography>
              
              <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
                Tu contraseña ha sido actualizada exitosamente. 
                Redirigiendo al login...
              </Typography>
              
              <CircularProgress />
            </CardContent>
          </Card>
        </Box>
      </Container>
    );
  }

  const passwordStrength = getPasswordStrength(password);

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4
        }}
      >
        <Card
          sx={{
            width: '100%',
            maxWidth: 500,
            boxShadow: theme.shadows[8],
            borderRadius: 3
          }}
        >
          <CardContent sx={{ p: 6 }}>
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  mb: 3
                }}
              >
                <LockIcon sx={{ fontSize: 32, color: 'primary.main' }} />
              </Box>
              
              <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
                Nueva Contraseña
              </Typography>
              
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                Ingresa tu nueva contraseña segura
              </Typography>
            </Box>

            {/* Form */}
            <Box component="form" onSubmit={handleSubmit}>
              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}
              
              <TextField
                fullWidth
                label="Nueva Contraseña"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: (
                    <LockIcon sx={{ color: 'text.secondary', mr: 1 }} />
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              
              {password && (
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      Seguridad de la contraseña:
                    </Typography>
                    <Typography 
                      variant="caption" 
                      sx={{ color: getPasswordStrengthColor(passwordStrength), fontWeight: 600 }}
                    >
                      {getPasswordStrengthText(passwordStrength)}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={passwordStrength}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: alpha(theme.palette.grey[500], 0.2),
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: getPasswordStrengthColor(passwordStrength),
                        borderRadius: 3
                      }
                    }}
                  />
                </Box>
              )}
              
              <TextField
                fullWidth
                label="Confirmar Contraseña"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                sx={{ mb: 4 }}
                InputProps={{
                  startAdornment: (
                    <LockIcon sx={{ color: 'text.secondary', mr: 1 }} />
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isLoading || !password || !confirmPassword}
                sx={{
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600
                }}
              >
                {isLoading ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 2 }} />
                    Actualizando contraseña...
                  </>
                ) : (
                  'Actualizar contraseña'
                )}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default NewPassword;