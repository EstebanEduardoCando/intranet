import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  AppBar,
  Toolbar,
  Link,
  Alert,
  CircularProgress,
  MenuItem,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import { useAuthStore } from '../store/useAuth';
import { useNavigate } from 'react-router-dom';
import { CreateUserData } from '../../domain/user/User';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    secondLastName: '',
    identityType: 'DNI' as const,
    identityNumber: '',
    email: '',
    phone: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [validationError, setValidationError] = useState('');
  
  const { register, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setValidationError('');
    
    // Validation
    const requiredFields = ['firstName', 'lastName', 'identityNumber', 'email', 'password', 'confirmPassword'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      setValidationError('Por favor completa todos los campos obligatorios');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setValidationError('Las contraseñas no coinciden');
      return;
    }
    
    if (formData.password.length < 8) {
      setValidationError('La contraseña debe tener al menos 8 caracteres');
      return;
    }
    
    if (formData.identityNumber.length < 3) {
      setValidationError('El número de identidad debe tener al menos 3 caracteres');
      return;
    }
    
    try {
      const userData: CreateUserData = {
        email: formData.email.trim(),
        password: formData.password,
        person: {
          firstName: formData.firstName.trim(),
          middleName: formData.middleName.trim() || undefined,
          lastName: formData.lastName.trim(),
          secondLastName: formData.secondLastName.trim() || undefined,
          identityType: formData.identityType,
          identityNumber: formData.identityNumber.trim(),
          phone: formData.phone.trim() || undefined
        },
        username: formData.username.trim() || undefined
      };
      
      await register(userData);
      navigate('/dashboard');
    } catch (error) {
      // Error is handled by the store
    }
  };

  const handleChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    if (validationError) setValidationError('');
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  const IllustrationComponent = () => (
    <Box
      sx={{
        width: '100%',
        height: '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%)',
        borderRadius: 2,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Geometric shapes background */}
      <Box
        sx={{
          position: 'absolute',
          width: '120px',
          height: '120px',
          border: '3px solid #10b981',
          borderRadius: '20px',
          top: '20%',
          left: '15%',
          transform: 'rotate(15deg)',
          opacity: 0.3
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          width: '80px',
          height: '80px',
          border: '3px solid #3b82f6',
          borderRadius: '15px',
          top: '60%',
          right: '20%',
          transform: 'rotate(-25deg)',
          opacity: 0.4
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          width: '60px',
          height: '60px',
          border: '3px solid #8b5cf6',
          borderRadius: '10px',
          top: '10%',
          right: '30%',
          transform: 'rotate(45deg)',
          opacity: 0.5
        }}
      />
      
      {/* Welcome illustration */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          zIndex: 1
        }}
      >
        {/* Welcome icon */}
        <Box
          sx={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            backgroundColor: '#10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2,
            boxShadow: '0 8px 32px rgba(16, 185, 129, 0.3)'
          }}
        >
          <Typography variant="h2" sx={{ color: 'white' }}>
            👋
          </Typography>
        </Box>
        
        <Typography variant="h5" sx={{ color: '#1e293b', fontWeight: 600, textAlign: 'center' }}>
          ¡Únete a nuestro equipo!
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Header/Navigation */}
      <AppBar 
        position="static" 
        elevation={0} 
        sx={{ 
          backgroundColor: '#334155',
          borderBottom: '1px solid #e2e8f0'
        }}
      >
        <Container maxWidth="lg">
          <Toolbar sx={{ py: 1 }}>
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                flexGrow: 1, 
                fontWeight: 'bold',
                color: 'white'
              }}
            >
              🏢 intranet.
            </Typography>
            <Box sx={{ display: 'flex', gap: 3 }}>
              <Link href="#" color="inherit" underline="none" sx={{ '&:hover': { color: '#60a5fa' } }}>
                Inicio
              </Link>
              <Link href="#" color="inherit" underline="none" sx={{ '&:hover': { color: '#60a5fa' } }}>
                Sobre Nosotros
              </Link>
              <Link href="#" color="inherit" underline="none" sx={{ '&:hover': { color: '#60a5fa' } }}>
                Contacto
              </Link>
            </Box>
            <Button 
              variant="outlined" 
              onClick={() => navigate('/login')}
              sx={{ 
                ml: 3,
                borderColor: 'white',
                color: 'white',
                '&:hover': { 
                  borderColor: '#60a5fa',
                  backgroundColor: 'rgba(96, 165, 250, 0.1)'
                }
              }}
            >
              Iniciar Sesión
            </Button>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={8} alignItems="center">
          {/* Left Column - Form */}
          <Grid item xs={12} md={6}>
            <Box sx={{ maxWidth: 400 }}>
              <Typography 
                variant="overline" 
                sx={{ 
                  color: '#64748b',
                  letterSpacing: '0.1em',
                  fontWeight: 600,
                  mb: 2,
                  display: 'block'
                }}
              >
                CREAR CUENTA
              </Typography>
              
              <Typography 
                variant="h3" 
                component="h1" 
                sx={{ 
                  fontWeight: 'bold',
                  color: '#1e293b',
                  mb: 2,
                  lineHeight: 1.2
                }}
              >
                Regístrate hoy
              </Typography>
              
              <Typography 
                variant="body1" 
                sx={{ 
                  color: '#64748b',
                  mb: 4,
                  lineHeight: 1.6
                }}
              >
                Completa el formulario para crear tu cuenta y acceder a todas las funcionalidades.
              </Typography>

              {(error || validationError) && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {validationError || error}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
                {/* Personal Information Section */}
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    fontWeight: 600,
                    color: '#1e293b',
                    mb: 2,
                    borderBottom: '2px solid #e2e8f0',
                    pb: 1
                  }}
                >
                  Información Personal
                </Typography>

                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#374151', mb: 1 }}>
                      Primer Nombre *
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder="Ej: Juan"
                      value={formData.firstName}
                      onChange={handleChange('firstName')}
                      required
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: 'white',
                          borderRadius: '8px',
                          '& fieldset': {
                            borderColor: '#d1d5db'
                          },
                          '&:hover fieldset': {
                            borderColor: '#9ca3af'
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#3b82f6'
                          }
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#374151', mb: 1 }}>
                      Segundo Nombre
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder="Ej: Carlos"
                      value={formData.middleName}
                      onChange={handleChange('middleName')}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: 'white',
                          borderRadius: '8px',
                          '& fieldset': {
                            borderColor: '#d1d5db'
                          },
                          '&:hover fieldset': {
                            borderColor: '#9ca3af'
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#3b82f6'
                          }
                        }
                      }}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#374151', mb: 1 }}>
                      Primer Apellido *
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder="Ej: Pérez"
                      value={formData.lastName}
                      onChange={handleChange('lastName')}
                      required
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: 'white',
                          borderRadius: '8px',
                          '& fieldset': {
                            borderColor: '#d1d5db'
                          },
                          '&:hover fieldset': {
                            borderColor: '#9ca3af'
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#3b82f6'
                          }
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#374151', mb: 1 }}>
                      Segundo Apellido
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder="Ej: García"
                      value={formData.secondLastName}
                      onChange={handleChange('secondLastName')}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: 'white',
                          borderRadius: '8px',
                          '& fieldset': {
                            borderColor: '#d1d5db'
                          },
                          '&:hover fieldset': {
                            borderColor: '#9ca3af'
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#3b82f6'
                          }
                        }
                      }}
                    />
                  </Grid>
                </Grid>

                {/* Identity Section */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#374151', mb: 1 }}>
                      Tipo de Documento *
                    </Typography>
                    <FormControl fullWidth>
                      <Select
                        value={formData.identityType}
                        onChange={(e) => setFormData(prev => ({ ...prev, identityType: e.target.value as any }))}
                        sx={{
                          backgroundColor: 'white',
                          borderRadius: '8px',
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#d1d5db'
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#9ca3af'
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#3b82f6'
                          }
                        }}
                      >
                        <MenuItem value="DNI">DNI</MenuItem>
                        <MenuItem value="PASSPORT">Pasaporte</MenuItem>
                        <MenuItem value="CC">Cédula</MenuItem>
                        <MenuItem value="NIE">NIE</MenuItem>
                        <MenuItem value="OTHER">Otro</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#374151', mb: 1 }}>
                      Número de Documento *
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder="Ej: 12345678"
                      value={formData.identityNumber}
                      onChange={handleChange('identityNumber')}
                      required
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: 'white',
                          borderRadius: '8px',
                          '& fieldset': {
                            borderColor: '#d1d5db'
                          },
                          '&:hover fieldset': {
                            borderColor: '#9ca3af'
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#3b82f6'
                          }
                        }
                      }}
                    />
                  </Grid>
                </Grid>

                {/* Contact Information Section */}
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    fontWeight: 600,
                    color: '#1e293b',
                    mb: 2,
                    borderBottom: '2px solid #e2e8f0',
                    pb: 1
                  }}
                >
                  Información de Contacto
                </Typography>

                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#374151', mb: 1 }}>
                      Correo Electrónico *
                    </Typography>
                    <TextField
                      fullWidth
                      type="email"
                      placeholder="correo@empresa.com"
                      value={formData.email}
                      onChange={handleChange('email')}
                      required
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: 'white',
                          borderRadius: '8px',
                          '& fieldset': {
                            borderColor: '#d1d5db'
                          },
                          '&:hover fieldset': {
                            borderColor: '#9ca3af'
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#3b82f6'
                          }
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#374151', mb: 1 }}>
                      Teléfono
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder="Ej: +51 999 999 999"
                      value={formData.phone}
                      onChange={handleChange('phone')}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: 'white',
                          borderRadius: '8px',
                          '& fieldset': {
                            borderColor: '#d1d5db'
                          },
                          '&:hover fieldset': {
                            borderColor: '#9ca3af'
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#3b82f6'
                          }
                        }
                      }}
                    />
                  </Grid>
                </Grid>

                {/* Account Information Section */}
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    fontWeight: 600,
                    color: '#1e293b',
                    mb: 2,
                    borderBottom: '2px solid #e2e8f0',
                    pb: 1
                  }}
                >
                  Información de Cuenta
                </Typography>

                <Typography variant="body2" sx={{ fontWeight: 600, color: '#374151', mb: 1 }}>
                  Nombre de Usuario (opcional)
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Ej: jperez"
                  value={formData.username}
                  onChange={handleChange('username')}
                  sx={{
                    mb: 3,
                    '& .MuiOutlinedInput-root': { backgroundColor: 'white', borderRadius: '8px' }
                  }}
                />

                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#374151', mb: 1 }}>
                      Contraseña *
                    </Typography>
                    <TextField
                      fullWidth
                      type="password"
                      placeholder="Mínimo 8 caracteres"
                      value={formData.password}
                      onChange={handleChange('password')}
                      required
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: 'white',
                          borderRadius: '8px',
                          '& fieldset': {
                            borderColor: '#d1d5db'
                          },
                          '&:hover fieldset': {
                            borderColor: '#9ca3af'
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#3b82f6'
                          }
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#374151', mb: 1 }}>
                      Confirmar Contraseña *
                    </Typography>
                    <TextField
                      fullWidth
                      type="password"
                      placeholder="Repite tu contraseña"
                      value={formData.confirmPassword}
                      onChange={handleChange('confirmPassword')}
                      required
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: 'white',
                          borderRadius: '8px',
                          '& fieldset': {
                            borderColor: '#d1d5db'
                          },
                          '&:hover fieldset': {
                            borderColor: '#9ca3af'
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#3b82f6'
                          }
                        }
                      }}
                    />
                  </Grid>
                </Grid>

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    variant="outlined"
                    onClick={handleBackToLogin}
                    disabled={isLoading}
                    sx={{
                      px: 3,
                      py: 1.5,
                      borderColor: '#d1d5db',
                      color: '#374151',
                      borderRadius: '8px',
                      textTransform: 'none',
                      fontWeight: 600,
                      '&:hover': {
                        borderColor: '#9ca3af',
                        backgroundColor: '#f9fafb'
                      }
                    }}
                  >
                    Ya tengo cuenta
                  </Button>
                  
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isLoading}
                    sx={{
                      px: 3,
                      py: 1.5,
                      backgroundColor: '#10b981',
                      borderRadius: '8px',
                      textTransform: 'none',
                      fontWeight: 600,
                      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                      '&:hover': {
                        backgroundColor: '#059669',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }
                    }}
                  >
                    {isLoading ? <CircularProgress size={20} color="inherit" /> : 'Crear Cuenta'}
                  </Button>
                </Box>

                <Box sx={{ textAlign: 'center', mt: 3 }}>
                  <Typography variant="body2" sx={{ color: '#64748b' }}>
                    ¿Ya tienes cuenta?{' '}
                    <Link 
                      component="button"
                      type="button"
                      onClick={() => navigate('/login')}
                      sx={{ 
                        color: '#10b981', 
                        textDecoration: 'none',
                        fontWeight: 600,
                        '&:hover': { 
                          textDecoration: 'underline',
                          color: '#059669'
                        }
                      }}
                    >
                      Inicia sesión aquí
                    </Link>
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Right Column - Illustration */}
          <Grid item xs={12} md={6}>
            <IllustrationComponent />
          </Grid>
        </Grid>
      </Container>

      {/* Footer */}
      <Box 
        component="footer" 
        sx={{ 
          backgroundColor: 'white',
          borderTop: '1px solid #e2e8f0',
          py: 4,
          mt: 8
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1e293b' }}>
              🏢 intranet.
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 3 }}>
              <Link href="#" color="#64748b" underline="none" sx={{ '&:hover': { color: '#3b82f6' } }}>
                Inicio
              </Link>
              <Link href="#" color="#64748b" underline="none" sx={{ '&:hover': { color: '#3b82f6' } }}>
                Documentación
              </Link>
            </Box>
          </Box>
          
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#9ca3af',
              textAlign: 'center',
              mt: 3,
              pt: 3,
              borderTop: '1px solid #e2e8f0'
            }}
          >
            © Intranet. 2025, Desarrollado con ❤️. Todos los derechos reservados
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Register;