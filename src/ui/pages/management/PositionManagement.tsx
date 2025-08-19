import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
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
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Search as SearchIcon,
  History as HistoryIcon,
  Work as WorkIcon
} from '@mui/icons-material';
import { Position } from '../../../domain/position/Position';
import { GetPositions } from '../../../application/position/GetPositions';
import { SupabasePositionRepository } from '../../../infrastructure/supabase/SupabasePositionRepository';
import { useNotifications } from '../../contexts/NotificationContext';
import { useAuthStore } from '../../store/useAuth';

// Dependency injection
const positionRepository = new SupabasePositionRepository();
const getPositions = new GetPositions(positionRepository);

interface PositionFilter {
  searchText: string;
  status: 'all' | 'active' | 'inactive';
  sortBy: 'name' | 'level' | 'created_at' | 'updated_at';
  sortOrder: 'asc' | 'desc';
}

const PositionManagement: React.FC = () => {
  const { user } = useAuthStore();
  const { showSuccess, showError } = useNotifications();
  
  // Estados
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Paginación
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  
  // Filtros
  const [filter, setFilter] = useState<PositionFilter>({
    searchText: '',
    status: 'all',
    sortBy: 'name',
    sortOrder: 'asc'
  });
  
  // Diálogos
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  
  // Estados de formulario
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    level: ''
  });
  
  // Menú de acciones
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [actionPosition, setActionPosition] = useState<Position | null>(null);

  // Cargar datos
  const loadPositions = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getPositions.execute();
      
      // Aplicar filtros localmente
      let filteredPositions = result;
      
      if (filter.searchText) {
        const searchLower = filter.searchText.toLowerCase();
        filteredPositions = filteredPositions.filter(position =>
          position.name?.toLowerCase().includes(searchLower) ||
          position.description?.toLowerCase().includes(searchLower) ||
          position.level?.toLowerCase().includes(searchLower)
        );
      }
      
      if (filter.status !== 'all') {
        const isActive = filter.status === 'active';
        filteredPositions = filteredPositions.filter(position => !position.isDeleted === isActive);
      }
      
      // Ordenar
      filteredPositions.sort((a, b) => {
        let valueA: any, valueB: any;
        
        switch (filter.sortBy) {
          case 'name':
            valueA = (a.name || '').toLowerCase();
            valueB = (b.name || '').toLowerCase();
            break;
          case 'level':
            valueA = (a.level || '').toLowerCase();
            valueB = (b.level || '').toLowerCase();
            break;
          case 'created_at':
            valueA = a.createdAt;
            valueB = b.createdAt;
            break;
          case 'updated_at':
            valueA = a.updatedAt;
            valueB = b.updatedAt;
            break;
          default:
            valueA = (a.name || '').toLowerCase();
            valueB = (b.name || '').toLowerCase();
        }
        
        if (filter.sortOrder === 'asc') {
          return valueA > valueB ? 1 : -1;
        } else {
          return valueA < valueB ? 1 : -1;
        }
      });
      
      setTotalCount(filteredPositions.length);
      
      // Aplicar paginación
      const startIndex = page * rowsPerPage;
      const paginatedPositions = filteredPositions.slice(startIndex, startIndex + rowsPerPage);
      
      setPositions(paginatedPositions);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error loading positions';
      setError(errorMessage);
      showError('Error al cargar cargos', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Efectos
  useEffect(() => {
    loadPositions();
  }, [page, rowsPerPage, filter]);

  // Handlers de paginación
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handlers de filtros
  const handleFilterChange = (newFilter: Partial<PositionFilter>) => {
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
  const handleCreateClick = () => {
    setFormData({
      name: '',
      description: '',
      level: ''
    });
    setCreateDialogOpen(true);
  };

  const handleEditClick = (position: Position) => {
    setSelectedPosition(position);
    setFormData({
      name: position.name,
      description: position.description || '',
      level: position.level || ''
    });
    setEditDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteClick = (position: Position) => {
    setSelectedPosition(position);
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleHistoryClick = (position: Position) => {
    setSelectedPosition(position);
    setHistoryDialogOpen(true);
    handleMenuClose();
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, position: Position) => {
    setAnchorEl(event.currentTarget);
    setActionPosition(position);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setActionPosition(null);
  };

  // Handlers de formulario
  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCreateSubmit = async () => {
    try {
      if (!user?.id) {
        showError('Usuario no autenticado');
        return;
      }

      // Validar campos requeridos
      if (!formData.name.trim()) {
        showError('El nombre del cargo es requerido');
        return;
      }

      await positionRepository.create({
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        level: formData.level.trim() || undefined
      }, user.id);

      showSuccess('Cargo creado exitosamente');
      setCreateDialogOpen(false);
      loadPositions();
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Error al crear cargo');
    }
  };

  const handleEditSubmit = async () => {
    try {
      if (!user?.id || !selectedPosition) {
        showError('Usuario no autenticado o cargo no seleccionado');
        return;
      }

      // Validar campos requeridos
      if (!formData.name.trim()) {
        showError('El nombre del cargo es requerido');
        return;
      }

      await positionRepository.update(selectedPosition.positionId, {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        level: formData.level.trim() || undefined
      }, user.id);

      showSuccess('Cargo actualizado exitosamente');
      setEditDialogOpen(false);
      loadPositions();
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Error al actualizar cargo');
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      if (!user?.id || !selectedPosition) {
        showError('Usuario no autenticado o cargo no seleccionado');
        return;
      }

      await positionRepository.delete(selectedPosition.positionId, user.id);
      showSuccess('Cargo eliminado exitosamente');
      setDeleteDialogOpen(false);
      loadPositions();
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Error al eliminar cargo');
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };


  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WorkIcon color="primary" />
          Administración de Cargos
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Gestiona los cargos del sistema con registro completo de auditoría
        </Typography>
      </Box>

      {/* Controles */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Búsqueda */}
            <TextField
              placeholder="Buscar cargos..."
              variant="outlined"
              size="small"
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
              }}
              sx={{ minWidth: 250 }}
            />
            
            {/* Filtro de estado */}
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Estado</InputLabel>
              <Select
                value={filter.status}
                label="Estado"
                onChange={(e) => handleFilterChange({ status: e.target.value as any })}
              >
                <MenuItem value="all">Todos</MenuItem>
                <MenuItem value="active">Activos</MenuItem>
                <MenuItem value="inactive">Inactivos</MenuItem>
              </Select>
            </FormControl>
            
            {/* Ordenar por */}
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Ordenar por</InputLabel>
              <Select
                value={filter.sortBy}
                label="Ordenar por"
                onChange={(e) => handleFilterChange({ sortBy: e.target.value as any })}
              >
                <MenuItem value="name">Nombre</MenuItem>
                <MenuItem value="created_at">Fecha creación</MenuItem>
                <MenuItem value="updated_at">Última modificación</MenuItem>
              </Select>
            </FormControl>
            
            {/* Orden */}
            <FormControl size="small" sx={{ minWidth: 100 }}>
              <InputLabel>Orden</InputLabel>
              <Select
                value={filter.sortOrder}
                label="Orden"
                onChange={(e) => handleFilterChange({ sortOrder: e.target.value as any })}
              >
                <MenuItem value="asc">Ascendente</MenuItem>
                <MenuItem value="desc">Descendente</MenuItem>
              </Select>
            </FormControl>
            
            <Box sx={{ flexGrow: 1 }} />
            
            {/* Botón crear */}
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateClick}
            >
              Nuevo Cargo
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Error */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Tabla */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Cargo</TableCell>
                <TableCell>Nivel</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Última modificación</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {positions.map((position) => (
                <TableRow key={position.positionId} hover>
                  <TableCell>
                    <Box>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {position.name}
                      </Typography>
                      {position.description && (
                        <Typography variant="caption" color="text.secondary">
                          {position.description}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    {position.level ? (
                      <Chip 
                        label={position.level}
                        size="small"
                        variant="outlined"
                      />
                    ) : (
                      <Typography variant="body2" color="text.secondary">-</Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={position.isDeleted ? 'Inactivo' : 'Activo'}
                      color={position.isDeleted ? 'error' : 'success'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatDate(position.updatedAt)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuClick(e, position)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          component="div"
          count={totalCount}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Filas por página"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
        />
      </Card>

      {/* Menú de acciones */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => actionPosition && handleEditClick(actionPosition)}>
          <EditIcon sx={{ mr: 1 }} fontSize="small" />
          Editar
        </MenuItem>
        <MenuItem onClick={() => actionPosition && handleHistoryClick(actionPosition)}>
          <HistoryIcon sx={{ mr: 1 }} fontSize="small" />
          Ver historial
        </MenuItem>
        <Divider />
        <MenuItem 
          onClick={() => actionPosition && handleDeleteClick(actionPosition)}
          sx={{ color: 'error.main' }}
        >
          <DeleteIcon sx={{ mr: 1 }} fontSize="small" />
          {actionPosition?.isDeleted ? 'Restaurar' : 'Eliminar'}
        </MenuItem>
      </Menu>

      {/* Diálogo de creación */}
      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Nuevo Cargo</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Nombre del cargo"
              value={formData.name}
              onChange={(e) => handleFormChange('name', e.target.value)}
              required
              fullWidth
            />
            
            <TextField
              label="Nivel"
              value={formData.level}
              onChange={(e) => handleFormChange('level', e.target.value)}
              placeholder="Junior, Senior, Lead, Manager, Director, etc."
              fullWidth
            />
            
            <TextField
              label="Descripción"
              value={formData.description}
              onChange={(e) => handleFormChange('description', e.target.value)}
              multiline
              rows={3}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleCreateSubmit}
            variant="contained"
            disabled={!formData.name.trim()}
          >
            Crear Cargo
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de edición */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Editar Cargo</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Nombre del cargo"
              value={formData.name}
              onChange={(e) => handleFormChange('name', e.target.value)}
              required
              fullWidth
            />
            
            <TextField
              label="Nivel"
              value={formData.level}
              onChange={(e) => handleFormChange('level', e.target.value)}
              placeholder="Junior, Senior, Lead, Manager, Director, etc."
              fullWidth
            />
            
            <TextField
              label="Descripción"
              value={formData.description}
              onChange={(e) => handleFormChange('description', e.target.value)}
              multiline
              rows={3}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleEditSubmit}
            variant="contained"
            disabled={!formData.name.trim()}
          >
            Guardar Cambios
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de eliminación */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>
          {selectedPosition?.isDeleted ? 'Restaurar Cargo' : 'Eliminar Cargo'}
        </DialogTitle>
        <DialogContent>
          <Typography>
            {selectedPosition?.isDeleted 
              ? `¿Estás seguro que deseas restaurar el cargo "${selectedPosition?.name}"?`
              : `¿Estás seguro que deseas eliminar el cargo "${selectedPosition?.name}"? Esta acción se puede revertir posteriormente.`
            }
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleDeleteConfirm}
            variant="contained"
            color={selectedPosition?.isDeleted ? 'primary' : 'error'}
          >
            {selectedPosition?.isDeleted ? 'Restaurar' : 'Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de historial */}
      <Dialog
        open={historyDialogOpen}
        onClose={() => setHistoryDialogOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          Historial de Cambios - {selectedPosition?.name}
        </DialogTitle>
        <DialogContent>
          <Alert severity="info">
            El historial de cambios se implementará con el sistema de auditoría.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHistoryDialogOpen(false)}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PositionManagement;