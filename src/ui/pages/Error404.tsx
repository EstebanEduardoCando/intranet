import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  useTheme
} from '@mui/material';
import {
  Home,
  ArrowBack,
  SentimentVeryDissatisfied
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Error404: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        padding: 2
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={8}
          sx={{
            padding: { xs: 4, md: 8 },
            textAlign: 'center',
            borderRadius: 4,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)'
          }}
        >
          {/* Large 404 Number */}
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '6rem', md: '12rem' },
              fontWeight: 'bold',
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: 1,
              mb: 2
            }}
          >
            404
          </Typography>

          {/* Sad Face Icon */}
          <SentimentVeryDissatisfied
            sx={{
              fontSize: { xs: 60, md: 80 },
              color: theme.palette.primary.main,
              mb: 3
            }}
          />

          {/* Main Heading */}
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              color: theme.palette.text.primary,
              mb: 2,
              fontSize: { xs: '2rem', md: '3rem' }
            }}
          >
            Página no encontrada
          </Typography>

          {/* Description */}
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.text.secondary,
              mb: 4,
              maxWidth: 600,
              mx: 'auto',
              lineHeight: 1.6
            }}
          >
            Lo sentimos, la página que estás buscando no existe o ha sido movida. 
            Verifica la URL o regresa a la página principal.
          </Typography>

          {/* Action Buttons */}
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              justifyContent: 'center',
              flexWrap: 'wrap',
              mt: 4
            }}
          >
            <Button
              variant="contained"
              size="large"
              startIcon={<Home />}
              onClick={handleGoHome}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                borderRadius: 3,
                textTransform: 'none',
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                '&:hover': {
                  background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                  transform: 'translateY(-2px)',
                  boxShadow: theme.shadows[8]
                },
                transition: 'all 0.3s ease'
              }}
            >
              Ir al Inicio
            </Button>

            <Button
              variant="outlined"
              size="large"
              startIcon={<ArrowBack />}
              onClick={handleGoBack}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                borderRadius: 3,
                textTransform: 'none',
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2,
                  transform: 'translateY(-2px)',
                  boxShadow: theme.shadows[4]
                },
                transition: 'all 0.3s ease'
              }}
            >
              Volver Atrás
            </Button>
          </Box>

          {/* Additional Help Text */}
          <Box sx={{ mt: 6, pt: 4, borderTop: `1px solid ${theme.palette.divider}` }}>
            <Typography variant="body2" color="text.secondary">
              ¿Necesitas ayuda? Contáctanos en{' '}
              <Typography
                component="span"
                sx={{
                  color: theme.palette.primary.main,
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  '&:hover': { textDecoration: 'underline' }
                }}
              >
                soporte@intranet.com
              </Typography>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Error404;