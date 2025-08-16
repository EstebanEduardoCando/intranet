import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  Avatar,
  Chip,
  IconButton,
  useTheme,
  alpha,
  Stack,
  Divider
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  People as PeopleIcon,
  Assignment as TasksIcon,
  Email as EmailIcon,
  Event as EventIcon,
  Dashboard as DashboardIcon,
  MoreVert as MoreVertIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
  Circle as CircleIcon,
  WavingHand as WavingHandIcon
} from '@mui/icons-material';
import { useAuthStore } from '../store/useAuth';

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuthStore();
  
  // Obtener fecha y hora actual
  const now = new Date();
  const greeting = now.getHours() < 12 ? 'Buenos días' : now.getHours() < 18 ? 'Buenas tardes' : 'Buenas noches';
  const lastLoginDate = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const statsCards = [
    {
      title: 'Usuarios Activos',
      value: '2,847',
      change: '+12.5%',
      trend: 'up',
      icon: <PeopleIcon />,
      color: theme.palette.primary.main
    },
    {
      title: 'Tareas Completadas',
      value: '1,423',
      change: '+8.2%',
      trend: 'up',
      icon: <TasksIcon />,
      color: theme.palette.success.main
    },
    {
      title: 'Mensajes Nuevos',
      value: '847',
      change: '-3.1%',
      trend: 'down',
      icon: <EmailIcon />,
      color: theme.palette.info.main
    },
    {
      title: 'Eventos Programados',
      value: '34',
      change: '+15.3%',
      trend: 'up',
      icon: <EventIcon />,
      color: theme.palette.warning.main
    }
  ];

  const recentActivities = [
    {
      user: 'Juan Pérez',
      action: 'completó la tarea',
      target: 'Revisión de documentos Q4',
      time: 'hace 2 min',
      avatar: 'JP'
    },
    {
      user: 'María García',
      action: 'creó un nuevo',
      target: 'Proyecto de Marketing',
      time: 'hace 15 min',
      avatar: 'MG'
    },
    {
      user: 'Carlos López',
      action: 'programó una reunión',
      target: 'Revisión Trimestral',
      time: 'hace 1 hora',
      avatar: 'CL'
    },
    {
      user: 'Ana Martínez',
      action: 'subió un archivo',
      target: 'Informe_Final.pdf',
      time: 'hace 2 horas',
      avatar: 'AM'
    }
  ];

  const projectProgress = [
    {
      name: 'Sistema CRM',
      progress: 85,
      status: 'En Progreso',
      dueDate: '15 Ene',
      team: ['AM', 'CL', 'JP']
    },
    {
      name: 'App Móvil',
      progress: 60,
      status: 'En Desarrollo',
      dueDate: '28 Feb',
      team: ['MG', 'AM']
    },
    {
      name: 'Portal Web',
      progress: 95,
      status: 'Por Completar',
      dueDate: '08 Ene',
      team: ['JP', 'CL', 'MG', 'AM']
    }
  ];

  return (
    <Box>
      {/* Welcome Header */}
      <Card
        sx={{
          mb: 4,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.primary.main, 0.05)})`,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <WavingHandIcon sx={{ fontSize: 32, color: 'primary.main' }} />
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 600, mb: 0.5 }}>
                {greeting}, {user?.name || 'Usuario'}!
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                Bienvenido de nuevo a tu panel de control
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mt: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar
                sx={{
                  width: 24,
                  height: 24,
                  bgcolor: 'success.main',
                  fontSize: '0.75rem'
                }}
              >
                {user?.name?.charAt(0) || 'U'}
              </Avatar>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {user?.email || 'correo@ejemplo.com'}
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              •
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Último acceso: {lastLoginDate}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Stats Cards */}
        {statsCards.map((card, index) => (
          <Grid item xs={12} sm={6} lg={3} key={index}>
            <Card
              sx={{
                height: '100%',
                background: `linear-gradient(135deg, ${alpha(card.color, 0.1)}, ${alpha(card.color, 0.05)})`,
                border: `1px solid ${alpha(card.color, 0.12)}`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: theme.shadows[8]
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: card.color,
                      width: 48,
                      height: 48
                    }}
                  >
                    {card.icon}
                  </Avatar>
                  <IconButton size="small">
                    <MoreVertIcon />
                  </IconButton>
                </Box>
                <Typography variant="h4" sx={{ mb: 1, fontWeight: 700 }}>
                  {card.value}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                  {card.title}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {card.trend === 'up' ? (
                    <ArrowUpIcon sx={{ fontSize: 16, color: 'success.main' }} />
                  ) : (
                    <ArrowDownIcon sx={{ fontSize: 16, color: 'error.main' }} />
                  )}
                  <Typography
                    variant="caption"
                    sx={{
                      color: card.trend === 'up' ? 'success.main' : 'error.main',
                      fontWeight: 600
                    }}
                  >
                    {card.change}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    vs mes anterior
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {/* Project Progress */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Progreso de Proyectos
                </Typography>
                <IconButton size="small">
                  <MoreVertIcon />
                </IconButton>
              </Box>
              <Stack spacing={3}>
                {projectProgress.map((project, index) => (
                  <Box key={index}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {project.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip
                          label={project.status}
                          size="small"
                          color={project.progress >= 90 ? 'success' : project.progress >= 70 ? 'warning' : 'info'}
                          variant="outlined"
                        />
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {project.dueDate}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <LinearProgress
                        variant="determinate"
                        value={project.progress}
                        sx={{
                          flex: 1,
                          height: 8,
                          borderRadius: 4,
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 4,
                            bgcolor: project.progress >= 90 ? 'success.main' : project.progress >= 70 ? 'warning.main' : 'primary.main'
                          }
                        }}
                      />
                      <Typography variant="body2" sx={{ minWidth: 40, textAlign: 'right' }}>
                        {project.progress}%
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: -0.5 }}>
                        {project.team.map((member, memberIndex) => (
                          <Avatar
                            key={memberIndex}
                            sx={{
                              width: 28,
                              height: 28,
                              fontSize: '0.75rem',
                              bgcolor: theme.palette.primary.main,
                              ml: memberIndex > 0 ? -0.5 : 0,
                              border: `2px solid ${theme.palette.background.paper}`,
                              zIndex: project.team.length - memberIndex
                            }}
                          >
                            {member}
                          </Avatar>
                        ))}
                      </Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {project.team.length} miembros
                      </Typography>
                    </Box>
                    {index < projectProgress.length - 1 && <Divider sx={{ mt: 2 }} />}
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activities */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Actividad Reciente
                </Typography>
                <IconButton size="small">
                  <MoreVertIcon />
                </IconButton>
              </Box>
              <Stack spacing={2}>
                {recentActivities.map((activity, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Avatar
                      sx={{
                        width: 36,
                        height: 36,
                        fontSize: '0.75rem',
                        bgcolor: theme.palette.primary.main
                      }}
                    >
                      {activity.avatar}
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body2" sx={{ mb: 0.5 }}>
                        <strong>{activity.user}</strong> {activity.action}{' '}
                        <Typography component="span" sx={{ color: 'primary.main' }}>
                          {activity.target}
                        </Typography>
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {activity.time}
                      </Typography>
                    </Box>
                    <CircleIcon sx={{ fontSize: 6, color: 'primary.main', mt: 1 }} />
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
