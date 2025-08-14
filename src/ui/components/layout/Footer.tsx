import React from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Link,
  Stack,
  Divider,
  useTheme,
  alpha
} from '@mui/material';
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  GitHub as GitHubIcon,
  LinkedIn as LinkedInIcon,
  Twitter as TwitterIcon
} from '@mui/icons-material';

const Footer: React.FC = () => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: 'Empresa',
      links: [
        { label: 'Acerca de', href: '/about' },
        { label: 'Equipo', href: '/team' },
        { label: 'Carreras', href: '/careers' },
        { label: 'Contacto', href: '/contact' }
      ]
    },
    {
      title: 'Productos',
      links: [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Gestión', href: '/management' },
        { label: 'Reportes', href: '/reports' },
        { label: 'API', href: '/api' }
      ]
    },
    {
      title: 'Soporte',
      links: [
        { label: 'Documentación', href: '/docs' },
        { label: 'Ayuda', href: '/help' },
        { label: 'Tickets', href: '/tickets' },
        { label: 'Estado', href: '/status' }
      ]
    }
  ];

  const contactInfo = [
    {
      icon: <EmailIcon fontSize="small" />,
      text: 'contacto@intranet.com',
      href: 'mailto:contacto@intranet.com'
    },
    {
      icon: <PhoneIcon fontSize="small" />,
      text: '+1 (555) 123-4567',
      href: 'tel:+15551234567'
    },
    {
      icon: <LocationIcon fontSize="small" />,
      text: 'Ciudad, País',
      href: null
    }
  ];

  const socialLinks = [
    {
      icon: <GitHubIcon fontSize="small" />,
      href: 'https://github.com',
      label: 'GitHub'
    },
    {
      icon: <LinkedInIcon fontSize="small" />,
      href: 'https://linkedin.com',
      label: 'LinkedIn'
    },
    {
      icon: <TwitterIcon fontSize="small" />,
      href: 'https://twitter.com',
      label: 'Twitter'
    }
  ];

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: alpha(theme.palette.background.paper, 0.98),
        borderTop: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
        mt: 'auto',
        py: 4
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: 1.5,
                    bgcolor: theme.palette.primary.main,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 1.5,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '1rem',
                    }}
                  >
                    I
                  </Typography>
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: theme.palette.text.primary,
                  }}
                >
                  Intranet
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                Sistema integral de gestión empresarial diseñado para optimizar 
                la colaboración y productividad de equipos modernos.
              </Typography>
              <Stack spacing={1}>
                {contactInfo.map((info, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ color: 'text.secondary' }}>{info.icon}</Box>
                    {info.href ? (
                      <Link
                        href={info.href}
                        variant="body2"
                        sx={{
                          color: 'text.secondary',
                          textDecoration: 'none',
                          '&:hover': {
                            color: 'primary.main',
                            textDecoration: 'underline'
                          }
                        }}
                      >
                        {info.text}
                      </Link>
                    ) : (
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {info.text}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Stack>
            </Box>
          </Grid>

          {/* Footer Links */}
          {footerLinks.map((section, index) => (
            <Grid item xs={12} sm={4} md={2.5} key={index}>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  mb: 2
                }}
              >
                {section.title}
              </Typography>
              <Stack spacing={1}>
                {section.links.map((link, linkIndex) => (
                  <Link
                    key={linkIndex}
                    href={link.href}
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                      textDecoration: 'none',
                      display: 'block',
                      '&:hover': {
                        color: 'primary.main',
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </Stack>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Bottom Section */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2
          }}
        >
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            © {currentYear} Intranet. Todos los derechos reservados.
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {socialLinks.map((social, index) => (
              <Link
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: 'text.secondary',
                  p: 1,
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  '&:hover': {
                    color: 'primary.main',
                    bgcolor: alpha(theme.palette.primary.main, 0.1)
                  }
                }}
                aria-label={social.label}
              >
                {social.icon}
              </Link>
            ))}
          </Box>

          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Versión 2.0.0
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
