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
  useTheme
} from '@mui/material';
import { useAuthStore } from '../store/useAuth';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  const theme = useTheme();

  const handleLogin = () => {
    login();
    navigate('/dashboard');
  };

  const handleBackToLogin = () => {
    // En una app real, esto navegaría a una página de login diferente
    navigate('/');
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
          border: '3px solid #e2e8f0',
          borderRadius: '20px',
          top: '20%',
          left: '15%',
          transform: 'rotate(15deg)',
          opacity: 0.7
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          width: '80px',
          height: '80px',
          border: '3px solid #cbd5e0',
          borderRadius: '15px',
          top: '60%',
          right: '20%',
          transform: 'rotate(-25deg)',
          opacity: 0.6
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          width: '60px',
          height: '60px',
          border: '3px solid #a0aec0',
          borderRadius: '10px',
          top: '10%',
          right: '30%',
          transform: 'rotate(45deg)',
          opacity: 0.5
        }}
      />
      
      {/* Character illustration */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          zIndex: 1
        }}
      >
        {/* Head */}
        <Box
          sx={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: '#fef2f2',
            border: '3px solid #374151',
            position: 'relative',
            mb: 1
          }}
        >
          {/* Hair */}
          <Box
            sx={{
              position: 'absolute',
              top: '-10px',
              left: '15px',
              right: '15px',
              height: '40px',
              backgroundColor: '#ef4444',
              borderRadius: '50px 50px 20px 20px',
              border: '3px solid #374151'
            }}
          />
          {/* Face */}
          <Box sx={{ position: 'absolute', top: '25px', left: '20px' }}>
            <Box
              sx={{
                width: '8px',
                height: '8px',
                backgroundColor: '#374151',
                borderRadius: '50%',
                display: 'inline-block',
                mr: '12px'
              }}
            />
            <Box
              sx={{
                width: '8px',
                height: '8px',
                backgroundColor: '#374151',
                borderRadius: '50%',
                display: 'inline-block'
              }}
            />
          </Box>
          <Box
            sx={{
              position: 'absolute',
              top: '45px',
              left: '35px',
              width: '10px',
              height: '6px',
              border: '2px solid #374151',
              borderTop: 'none',
              borderRadius: '0 0 10px 10px'
            }}
          />
        </Box>
        
        {/* Body */}
        <Box
          sx={{
            width: '120px',
            height: '140px',
            backgroundColor: '#10b981',
            border: '3px solid #374151',
            borderRadius: '30px',
            position: 'relative'
          }}
        >
          {/* Arms */}
          <Box
            sx={{
              position: 'absolute',
              left: '-25px',
              top: '20px',
              width: '50px',
              height: '15px',
              backgroundColor: '#10b981',
              border: '3px solid #374151',
              borderRadius: '15px',
              transform: 'rotate(-20deg)'
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              right: '-25px',
              top: '20px',
              width: '50px',
              height: '15px',
              backgroundColor: '#10b981',
              border: '3px solid #374151',
              borderRadius: '15px',
              transform: 'rotate(20deg)'
            }}
          />
          {/* Hand gesture */}
          <Box
            sx={{
              position: 'absolute',
              right: '-45px',
              top: '35px',
              width: '20px',
              height: '20px',
              backgroundColor: '#fef2f2',
              border: '3px solid #374151',
              borderRadius: '50%'
            }}
          />
        </Box>
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
                Landings
              </Link>
              <Link href="#" color="inherit" underline="none" sx={{ '&:hover': { color: '#60a5fa' } }}>
                Company
              </Link>
              <Link href="#" color="inherit" underline="none" sx={{ '&:hover': { color: '#60a5fa' } }}>
                Account
              </Link>
              <Link href="#" color="inherit" underline="none" sx={{ '&:hover': { color: '#60a5fa' } }}>
                Pages
              </Link>
              <Link href="#" color="inherit" underline="none" sx={{ '&:hover': { color: '#60a5fa' } }}>
                Blog
              </Link>
              <Link href="#" color="inherit" underline="none" sx={{ '&:hover': { color: '#60a5fa' } }}>
                Portfolio
              </Link>
            </Box>
            <Button 
              variant="contained" 
              sx={{ 
                ml: 3,
                backgroundColor: '#3b82f6',
                '&:hover': { backgroundColor: '#2563eb' }
              }}
            >
              Buy now
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
                RECOVER ACCOUNT
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
                Forgot your password?
              </Typography>
              
              <Typography 
                variant="body1" 
                sx={{ 
                  color: '#64748b',
                  mb: 4,
                  lineHeight: 1.6
                }}
              >
                Enter your email address below and we'll get you back on track.
              </Typography>

              <Box component="form" sx={{ mb: 4 }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: 600,
                    color: '#374151',
                    mb: 1
                  }}
                >
                  Enter your email
                </Typography>
                
                <TextField
                  fullWidth
                  placeholder="Email *"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  sx={{
                    mb: 3,
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

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    variant="outlined"
                    onClick={handleBackToLogin}
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
                    Back to login
                  </Button>
                  
                  <Button
                    variant="contained"
                    onClick={handleLogin}
                    sx={{
                      px: 3,
                      py: 1.5,
                      backgroundColor: '#3b82f6',
                      borderRadius: '8px',
                      textTransform: 'none',
                      fontWeight: 600,
                      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                      '&:hover': {
                        backgroundColor: '#2563eb',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }
                    }}
                  >
                    Send reset link
                  </Button>
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
                Home
              </Link>
              <Link href="#" color="#64748b" underline="none" sx={{ '&:hover': { color: '#3b82f6' } }}>
                Documentation
              </Link>
              <Button 
                variant="outlined" 
                size="small"
                sx={{
                  borderColor: '#d1d5db',
                  color: '#374151',
                  textTransform: 'none',
                  '&:hover': { borderColor: '#3b82f6', color: '#3b82f6' }
                }}
              >
                Purchase now
              </Button>
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
          
          <Typography 
            variant="caption" 
            sx={{ 
              color: '#9ca3af',
              textAlign: 'center',
              display: 'block',
              mt: 1
            }}
          >
            Cuando visitas o interactúas con nuestros sitios, servicios o herramientas, nosotros o nuestros proveedores de servicios autorizados podemos usar cookies para almacenar información para ayudarte a proporcionar una experiencia mejor, más rápida y segura y para fines de marketing.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Login;
