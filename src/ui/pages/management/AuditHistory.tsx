import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Avatar,
  Tooltip,
} from '@mui/material';
import {
  Search as SearchIcon,
  History as HistoryIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Work as WorkIcon,
  Security as SecurityIcon,
  Extension as ModuleIcon,
  ExpandMore as ExpandMoreIcon,
  Visibility as ViewIcon,
  FilterList as FilterIcon,
  Assessment as StatsIcon,
  Timeline as TimelineIcon,
  Compare as CompareIcon,
  AccountCircle as UserIcon
} from '@mui/icons-material';
import { AuditLogDetailed, AuditLogFilter } from '../../../domain/audit/AuditLog';
import { GetAuditHistory } from '../../../application/audit/GetAuditHistory';
import { GetAuditStats } from '../../../application/audit/GetAuditStats';
import { SupabaseAuditRepository } from '../../../infrastructure/supabase/SupabaseAuditRepository';
import { useNotifications } from '../../contexts/NotificationContext';
import { useAuthStore } from '../../store/useAuth';

// Dependency injection
const auditRepository = new SupabaseAuditRepository();
const getAuditHistory = new GetAuditHistory(auditRepository);
const getAuditStats = new GetAuditStats(auditRepository);

const AuditHistory: React.FC = () => {
  const { user } = useAuthStore();
  const { showError } = useNotifications();
  
  // Estados
  const [auditLogs, setAuditLogs] = useState<AuditLogDetailed[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Paginación
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [hasMore, setHasMore] = useState(false);
  
  // Filtros
  const [filter, setFilter] = useState<AuditLogFilter>({
    dateFrom: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Última semana
    dateTo: new Date()
  });
  
  // Diálogos
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [statsDialogOpen, setStatsDialogOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<AuditLogDetailed | null>(null);

  // Cargar historial de auditoría
  const loadAuditHistory = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getAuditHistory.execute(filter, rowsPerPage, page * rowsPerPage);
      setAuditLogs(result.logs);
      setHasMore(result.hasMore);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error loading audit history';
      setError(errorMessage);
      showError('Error al cargar historial de auditoría', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Cargar estadísticas
  const loadStats = async () => {
    try {
      const result = await getAuditStats.execute();
      setStats(result);
    } catch (error) {
      console.error('Error loading audit stats:', error);
    }
  };

  // Efectos
  useEffect(() => {
    loadAuditHistory();
  }, [page, rowsPerPage, filter]);

  useEffect(() => {
    loadStats();
  }, []);

  // Handlers de paginación
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handlers de filtros
  const handleFilterChange = (newFilter: Partial<AuditLogFilter>) => {
    setFilter(prev => ({ ...prev, ...newFilter }));
    setPage(0);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchText = event.target.value;
    setTimeout(() => {
      handleFilterChange({ searchText });
    }, 300);
  };

  // Handlers de diálogos
  const handleViewDetail = (log: AuditLogDetailed) => {
    setSelectedLog(log);
    setDetailDialogOpen(true);
  };

  const handleShowStats = () => {
    setStatsDialogOpen(true);
  };

  // Utilidades
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  const getOperationColor = (operation: string) => {
    switch (operation) {
      case 'CREATE': return 'success';
      case 'UPDATE': return 'warning';
      case 'DELETE': return 'error';
      case 'RESTORE': return 'info';
      default: return 'default';
    }
  };

  const getOperationIcon = (operation: string) => {
    switch (operation) {
      case 'CREATE': return '➕';
      case 'UPDATE': return '✏️';
      case 'DELETE': return '🗑️';
      case 'RESTORE': return '↩️';
      default: return '❓';
    }
  };

  const getTableIcon = (tableName: string) => {
    switch (tableName) {
      case 'companies': return <BusinessIcon fontSize="small" />;
      case 'positions': return <WorkIcon fontSize="small" />;
      case 'roles': return <SecurityIcon fontSize="small" />;
      case 'modules': return <ModuleIcon fontSize="small" />;
      case 'users': return <PersonIcon fontSize="small" />;
      default: return <HistoryIcon fontSize="small" />;
    }
  };

  const getTableDisplayName = (tableName: string) => {
    const names: Record<string, string> = {
      companies: 'Empresas',
      positions: 'Cargos',
      roles: 'Roles',
      modules: 'Módulos',
      users: 'Usuarios',
      user_profiles: 'Perfiles de Usuario',
      persons: 'Personas'
    };
    return names[tableName] || tableName;
  };

  const renderJsonDiff = (oldValues: any, newValues: any) => {
    if (!oldValues && !newValues) return null;

    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Detalles del cambio:
        </Typography>
        
        {oldValues && (
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="body2" color="error">
                Valores anteriores
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box
                component="pre"
                sx={{
                  bgcolor: 'grey.100',
                  p: 1,
                  borderRadius: 1,
                  fontSize: '0.75rem',
                  overflow: 'auto',
                  maxHeight: 200
                }}
              >
                {JSON.stringify(oldValues, null, 2)}
              </Box>
            </AccordionDetails>
          </Accordion>
        )}
        
        {newValues && (
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="body2" color="success.main">
                Valores nuevos
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box
                component="pre"
                sx={{
                  bgcolor: 'grey.100',
                  p: 1,
                  borderRadius: 1,
                  fontSize: '0.75rem',
                  overflow: 'auto',
                  maxHeight: 200
                }}
              >
                {JSON.stringify(newValues, null, 2)}
              </Box>
            </AccordionDetails>
          </Accordion>
        )}
      </Box>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <HistoryIcon color="primary" />
            Historial de Auditoría
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Consulta todos los cambios realizados en el sistema con detalles completos
          </Typography>
        </Box>

        {/* Estadísticas rápidas */}
        {stats && (
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" color="primary">
                  {stats.totalChanges}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total de cambios
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" color="warning.main">
                  {Object.keys(stats.changesByTable).length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Tablas afectadas
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" color="info.main">
                  {stats.mostActiveUsers.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Usuarios activos
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Button
                  variant="outlined"
                  startIcon={<StatsIcon />}
                  onClick={handleShowStats}
                  fullWidth
                >
                  Ver estadísticas
                </Button>
              </Paper>
            </Grid>
          </Grid>
        )}

        {/* Controles de filtrado */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={3}>
                <TextField
                  placeholder="Buscar en historial..."
                  variant="outlined"
                  size="small"
                  onChange={handleSearchChange}
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
                  }}
                  fullWidth
                />
              </Grid>
              
              <Grid item xs={12} md={2}>
                <FormControl size="small" fullWidth>
                  <InputLabel>Tabla</InputLabel>
                  <Select
                    value={filter.tableName || ''}
                    label="Tabla"
                    onChange={(e) => handleFilterChange({ tableName: e.target.value || undefined })}
                  >
                    <MenuItem value="">Todas las tablas</MenuItem>
                    <MenuItem value="companies">Empresas</MenuItem>
                    <MenuItem value="positions">Cargos</MenuItem>
                    <MenuItem value="roles">Roles</MenuItem>
                    <MenuItem value="modules">Módulos</MenuItem>
                    <MenuItem value="users">Usuarios</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={2}>
                <FormControl size="small" fullWidth>
                  <InputLabel>Operación</InputLabel>
                  <Select
                    value={filter.operationType || ''}
                    label="Operación"
                    onChange={(e) => handleFilterChange({ operationType: e.target.value as any || undefined })}
                  >
                    <MenuItem value="">Todas</MenuItem>
                    <MenuItem value="CREATE">Creación</MenuItem>
                    <MenuItem value="UPDATE">Modificación</MenuItem>
                    <MenuItem value="DELETE">Eliminación</MenuItem>
                    <MenuItem value="RESTORE">Restauración</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={2}>
                <TextField
                  label="Fecha desde"
                  type="date"
                  size="small"
                  fullWidth
                  value={filter.dateFrom?.toISOString().split('T')[0] || ''}
                  onChange={(e) => handleFilterChange({ dateFrom: e.target.value ? new Date(e.target.value) : undefined })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              
              <Grid item xs={12} md={2}>
                <TextField
                  label="Fecha hasta"
                  type="date"
                  size="small"
                  fullWidth
                  value={filter.dateTo?.toISOString().split('T')[0] || ''}
                  onChange={(e) => handleFilterChange({ dateTo: e.target.value ? new Date(e.target.value) : undefined })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              
              <Grid item xs={12} md={1}>
                <Button
                  variant="outlined"
                  onClick={() => setFilter({ dateFrom: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), dateTo: new Date() })}
                  fullWidth
                >
                  Limpiar
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Error */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Tabla de historial */}
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Fecha/Hora</TableCell>
                  <TableCell>Usuario</TableCell>
                  <TableCell>Tabla</TableCell>
                  <TableCell>Operación</TableCell>
                  <TableCell>Registro</TableCell>
                  <TableCell>Campos modificados</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {auditLogs.map((log) => (
                  <TableRow key={log.auditId} hover>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(log.createdAt)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 24, height: 24 }}>
                          <UserIcon fontSize="small" />
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={600}>
                            {log.userFullName || log.userEmail || 'Usuario desconocido'}
                          </Typography>
                          {log.username && (
                            <Typography variant="caption" color="text.secondary">
                              @{log.username}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getTableIcon(log.tableName)}
                        <Typography variant="body2">
                          {getTableDisplayName(log.tableName)}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={`${getOperationIcon(log.operationType)} ${log.operationType}`}
                        color={getOperationColor(log.operationType) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        {log.recordId}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {log.changedFields && log.changedFields.length > 0 ? (
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                          {log.changedFields.slice(0, 3).map((field) => (
                            <Chip
                              key={field}
                              label={field}
                              size="small"
                              variant="outlined"
                            />
                          ))}
                          {log.changedFields.length > 3 && (
                            <Chip
                              label={`+${log.changedFields.length - 3} más`}
                              size="small"
                              variant="outlined"
                              color="info"
                            />
                          )}
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          -
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Ver detalles">
                        <IconButton
                          size="small"
                          onClick={() => handleViewDetail(log)}
                        >
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          <TablePagination
            component="div"
            count={-1} // Paginación infinita
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Filas por página"
            labelDisplayedRows={({ from, to }) => `${from}-${to}`}
            ActionsComponent={({ onPageChange, page }) => (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  size="small"
                  disabled={page === 0}
                  onClick={(e) => onPageChange(e, page - 1)}
                >
                  Anterior
                </Button>
                <Button
                  size="small"
                  disabled={!hasMore}
                  onClick={(e) => onPageChange(e, page + 1)}
                >
                  Siguiente
                </Button>
              </Box>
            )}
          />
        </Card>

        {/* Diálogo de detalles */}
        <Dialog
          open={detailDialogOpen}
          onClose={() => setDetailDialogOpen(false)}
          maxWidth="lg"
          fullWidth
        >
          <DialogTitle>
            Detalles del Cambio - ID {selectedLog?.auditId}
          </DialogTitle>
          <DialogContent>
            {selectedLog && (
              <Box>
                {/* Información básica */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" gutterBottom>
                      Información del cambio
                    </Typography>
                    <Paper sx={{ p: 2 }}>
                      <Typography variant="body2"><strong>Fecha:</strong> {formatDate(selectedLog.createdAt)}</Typography>
                      <Typography variant="body2"><strong>Tabla:</strong> {getTableDisplayName(selectedLog.tableName)}</Typography>
                      <Typography variant="body2"><strong>Operación:</strong> {selectedLog.operationType}</Typography>
                      <Typography variant="body2"><strong>ID del registro:</strong> {selectedLog.recordId}</Typography>
                      {selectedLog.comment && (
                        <Typography variant="body2"><strong>Comentario:</strong> {selectedLog.comment}</Typography>
                      )}
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" gutterBottom>
                      Información del usuario
                    </Typography>
                    <Paper sx={{ p: 2 }}>
                      <Typography variant="body2"><strong>Nombre:</strong> {selectedLog.userFullName || 'No disponible'}</Typography>
                      <Typography variant="body2"><strong>Email:</strong> {selectedLog.userEmail || 'No disponible'}</Typography>
                      {selectedLog.username && (
                        <Typography variant="body2"><strong>Usuario:</strong> @{selectedLog.username}</Typography>
                      )}
                      <Typography variant="body2"><strong>ID de usuario:</strong> {selectedLog.userId}</Typography>
                    </Paper>
                  </Grid>
                </Grid>

                {/* Campos modificados */}
                {selectedLog.changedFields && selectedLog.changedFields.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Campos modificados
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {selectedLog.changedFields.map((field) => (
                        <Chip
                          key={field}
                          label={field}
                          color="primary"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Box>
                )}

                {/* Datos JSON */}
                {renderJsonDiff(selectedLog.oldValues, selectedLog.newValues)}
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDetailDialogOpen(false)}>
              Cerrar
            </Button>
          </DialogActions>
        </Dialog>

        {/* Diálogo de estadísticas */}
        <Dialog
          open={statsDialogOpen}
          onClose={() => setStatsDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            Estadísticas de Auditoría
          </DialogTitle>
          <DialogContent>
            {stats && (
              <Grid container spacing={3}>
                {/* Cambios por tipo */}
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Cambios por tipo
                  </Typography>
                  <Paper sx={{ p: 2 }}>
                    {Object.entries(stats.changesByType).map(([type, count]) => (
                      <Box key={type} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">
                          {getOperationIcon(type)} {type}
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {count as number}
                        </Typography>
                      </Box>
                    ))}
                  </Paper>
                </Grid>

                {/* Cambios por tabla */}
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Cambios por tabla
                  </Typography>
                  <Paper sx={{ p: 2 }}>
                    {Object.entries(stats.changesByTable).map(([table, count]) => (
                      <Box key={table} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">
                          {getTableDisplayName(table)}
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {count as number}
                        </Typography>
                      </Box>
                    ))}
                  </Paper>
                </Grid>

                {/* Usuarios más activos */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Usuarios más activos
                  </Typography>
                  <Paper sx={{ p: 2 }}>
                    {stats.mostActiveUsers.slice(0, 5).map((userStat: any) => (
                      <Box key={userStat.userId} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar sx={{ width: 24, height: 24 }}>
                            <UserIcon fontSize="small" />
                          </Avatar>
                          <Typography variant="body2">
                            {userStat.userFullName}
                          </Typography>
                        </Box>
                        <Typography variant="body2" fontWeight={600}>
                          {userStat.changeCount} cambios
                        </Typography>
                      </Box>
                    ))}
                  </Paper>
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setStatsDialogOpen(false)}>
              Cerrar
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
  );
};

export default AuditHistory;