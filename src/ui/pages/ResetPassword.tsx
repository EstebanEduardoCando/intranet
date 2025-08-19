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
  useTheme,
  alpha,
  Link as MuiLink
} from '@mui/material';
import {
  Email as EmailIcon,
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { SupabaseAuthService } from '../../infrastructure/supabase/SupabaseAuthService';

const ResetPassword: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const authService = new SupabaseAuthService();
  
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('El email es requerido');
      return;
    }
    
    if (!validateEmail(email)) {
      setError('Ingresa un email válido');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      await authService.resetPassword(email);
      setSuccess(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al enviar email de recuperación');
    } finally {
      setIsLoading(false);
    }
  };

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
                ¡Email enviado!
              </Typography>
              
              <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
                Hemos enviado un enlace de recuperación a <strong>{email}</strong>. 
                Revisa tu bandeja de entrada y sigue las instrucciones.
              </Typography>
              
              <Alert severity="info" sx={{ mb: 4, textAlign: 'left' }}>
                <Typography variant="body2">
                  <strong>No encuentras el email?</strong><br />
                  • Revisa tu carpeta de spam<br />
                  • El email puede tardar unos minutos<br />
                  • Asegúrate de haber ingresado el email correcto
                </Typography>
              </Alert>
              
              <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                <Button
                  variant="outlined"
                  startIcon={<ArrowBackIcon />}
                  onClick={() => navigate('/login')}
                  fullWidth
                >
                  Volver al Login
                </Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    setSuccess(false);
                    setEmail('');
                  }}
                  fullWidth
                >
                  Enviar otro email
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Container>
    );
  }

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
                <EmailIcon sx={{ fontSize: 32, color: 'primary.main' }} />
              </Box>
              
              <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
                Recuperar Contraseña
              </Typography>
              
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña
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
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                sx={{ mb: 3 }}
                placeholder="correo@ejemplo.com"
                InputProps={{
                  startAdornment: (
                    <EmailIcon sx={{ color: 'text.secondary', mr: 1 }} />
                  )
                }}
              />
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isLoading}
                sx={{
                  py: 1.5,
                  mb: 3,
                  fontSize: '1rem',
                  fontWeight: 600
                }}
              >
                {isLoading ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 2 }} />
                    Enviando email...
                  </>
                ) : (
                  'Enviar enlace de recuperación'
                )}
              </Button>
              
              <Box sx={{ textAlign: 'center' }}>
                <MuiLink
                  component={Link}
                  to="/login"
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0.5,
                    textDecoration: 'none',
                    color: 'primary.main',
                    '&:hover': { textDecoration: 'underline' }
                  }}
                >
                  <ArrowBackIcon sx={{ fontSize: 18 }} />
                  Volver al Login
                </MuiLink>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default ResetPassword;