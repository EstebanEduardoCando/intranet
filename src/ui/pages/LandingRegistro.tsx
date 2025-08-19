import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  CssBaseline,
  Paper,
  Avatar,
  Chip
} from '@mui/material';
import {
  Business,
  Security,
  Speed,
  CheckCircle,
  Person,
  Email,
  Phone
} from '@mui/icons-material';

const LandingRegistro: React.FC = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    empresa: ''
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Datos del formulario:', formData);
    alert('¡Gracias por tu interés! Te contactaremos pronto.');
  };

  const features = [
    {
      icon: <Business sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Gestión Empresarial',
      description: 'Administra todos los aspectos de tu empresa desde una sola plataforma integrada.'
    },
    {
      icon: <Security sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Máxima Seguridad',
      description: 'Protección avanzada de datos con encriptación de nivel empresarial.'
    },
    {
      icon: <Speed sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Alto Rendimiento',
      description: 'Velocidad optimizada para manejar grandes volúmenes de información.'
    }
  ];

  const testimonials = [
    {
      name: 'Ana García',
      position: 'CEO, TechCorp',
      comment: 'La plataforma ha revolucionado la forma en que gestionamos nuestros procesos internos.'
    },
    {
      name: 'Carlos López',
      position: 'CTO, InnovaSoft',
      comment: 'Implementación sencilla y resultados inmediatos. Altamente recomendado.'
    }
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <CssBaseline />
      
      {/* Header */}
      <AppBar position="static" elevation={0} sx={{ backgroundColor: 'primary.main' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Intranet Pro
          </Typography>
          <Button color="inherit" sx={{ marginRight: 2 }}>
            Características
          </Button>
          <Button color="inherit" sx={{ marginRight: 2 }}>
            Precios
          </Button>
          <Button color="inherit">
            Contacto
          </Button>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 12,
          textAlign: 'center'
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
            Transforma tu Empresa con
            <br />
            <span style={{ color: '#ffeb3b' }}>Intranet Pro</span>
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
            La plataforma integral para la gestión empresarial moderna.
            Aumenta la productividad y mejora la comunicación interna.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              sx={{
                backgroundColor: '#ffeb3b',
                color: '#333',
                fontWeight: 'bold',
                px: 4,
                py: 2,
                '&:hover': { backgroundColor: '#fdd835' }
              }}
            >
              Comenzar Prueba Gratuita
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{
                borderColor: 'white',
                color: 'white',
                px: 4,
                py: 2,
                '&:hover': { borderColor: '#ffeb3b', backgroundColor: 'rgba(255,255,255,0.1)' }
              }}
            >
              Ver Demo
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 'bold', mb: 6 }}>
          ¿Por qué elegir Intranet Pro?
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ height: '100%', textAlign: 'center', p: 3, boxShadow: 3 }}>
                <CardContent>
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Registration Form Section */}
      <Box sx={{ backgroundColor: '#f5f5f5', py: 10 }}>
        <Container maxWidth="md">
          <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
            Únete a más de 1,000 empresas
          </Typography>
          <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 6 }}>
            Regístrate hoy y obtén acceso completo por 30 días gratis
          </Typography>
          
          <Paper elevation={3} sx={{ p: 6, borderRadius: 3 }}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Nombre completo"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    required
                    InputProps={{
                      startAdornment: <Person sx={{ color: 'action.active', mr: 1 }} />
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email empresarial"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    InputProps={{
                      startAdornment: <Email sx={{ color: 'action.active', mr: 1 }} />
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Teléfono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    InputProps={{
                      startAdornment: <Phone sx={{ color: 'action.active', mr: 1 }} />
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Empresa"
                    name="empresa"
                    value={formData.empresa}
                    onChange={handleInputChange}
                    required
                    InputProps={{
                      startAdornment: <Business sx={{ color: 'action.active', mr: 1 }} />
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
                    <Chip icon={<CheckCircle />} label="Sin tarjeta de crédito" color="success" />
                    <Chip icon={<CheckCircle />} label="Configuración en 5 minutos" color="success" />
                    <Chip icon={<CheckCircle />} label="Soporte 24/7" color="success" />
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    sx={{
                      py: 2,
                      fontSize: '1.2rem',
                      fontWeight: 'bold',
                      background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #1976D2 30%, #1EAEDB 90%)'
                      }
                    }}
                  >
                    Comenzar Prueba Gratuita
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 'bold', mb: 6 }}>
          Lo que dicen nuestros clientes
        </Typography>
        <Grid container spacing={4}>
          {testimonials.map((testimonial, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card sx={{ p: 4, height: '100%', boxShadow: 2 }}>
                <Typography variant="body1" sx={{ mb: 3, fontSize: '1.1rem', fontStyle: 'italic' }}>
                  "{testimonial.comment}"
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                    {testimonial.name.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {testimonial.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {testimonial.position}
                    </Typography>
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Footer */}
      <Box sx={{ backgroundColor: '#333', color: 'white', py: 6 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                Intranet Pro
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                La solución integral para la gestión empresarial moderna.
                Conecta, gestiona y crece con nosotros.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Contacto
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Email: info@intranetpro.com
                <br />
                Teléfono: +1 (555) 123-4567
                <br />
                Dirección: 123 Business St, Ciudad
              </Typography>
            </Grid>
          </Grid>
          <Box sx={{ textAlign: 'center', mt: 4, pt: 4, borderTop: '1px solid #555' }}>
            <Typography variant="body2" sx={{ opacity: 0.6 }}>
              © 2025 Intranet Pro. Todos los derechos reservados.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingRegistro;