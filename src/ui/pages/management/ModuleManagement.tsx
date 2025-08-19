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
  Divider,
  Grid,
  Paper,
  Avatar,
  Autocomplete
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Search as SearchIcon,
  History as HistoryIcon,
  Extension as ModuleIcon,
  ExpandMore as ExpandMoreIcon,
  ChevronRight as ChevronRightIcon,
  Folder as FolderIcon,
  FolderOpen as FolderOpenIcon,
  AccountTree as TreeIcon,
  // Iconos disponibles para módulos
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  Work as WorkIcon,
  Security as SecurityIcon,
  Settings as SettingsIcon,
  Assessment as AssessmentIcon,
  Assignment as AssignmentIcon,
  Store as StoreIcon,
  MonetizationOn as MoneyIcon,
  Inventory as InventoryIcon,
  LocalShipping as ShippingIcon,
  Analytics as AnalyticsIcon,
  Support as SupportIcon,
  Email as EmailIcon,
  Event as EventIcon,
  FilePresent as FileIcon
} from '@mui/icons-material';
import { Module } from '../../../domain/modules/Module';
import { GetModules } from '../../../application/modules/GetModules';
import { SupabaseModuleRepository } from '../../../infrastructure/supabase/SupabaseModuleRepository';
import { useNotifications } from '../../contexts/NotificationContext';
import { useAuthStore } from '../../store/useAuth';

// Dependency injection
const moduleRepository = new SupabaseModuleRepository();
const getModules = new GetModules(moduleRepository);

interface ModuleFilter {
  searchText: string;
  parentId: string;
  status: 'all' | 'active' | 'inactive';
  sortBy: 'name' | 'route' | 'order' | 'created_at' | 'updated_at';
  sortOrder: 'asc' | 'desc';
}

// Iconos disponibles para seleccionar
const AVAILABLE_ICONS = [
  { name: 'Dashboard', component: DashboardIcon, value: 'DashboardIcon' },
  { name: 'Personas', component: PeopleIcon, value: 'PeopleIcon' },
  { name: 'Empresas', component: BusinessIcon, value: 'BusinessIcon' },
  { name: 'Trabajo', component: WorkIcon, value: 'WorkIcon' },
  { name: 'Seguridad', component: SecurityIcon, value: 'SecurityIcon' },
  { name: 'Configuración', component: SettingsIcon, value: 'SettingsIcon' },
  { name: 'Reportes', component: AssessmentIcon, value: 'AssessmentIcon' },
  { name: 'Tareas', component: AssignmentIcon, value: 'AssignmentIcon' },
  { name: 'Tienda', component: StoreIcon, value: 'StoreIcon' },
  { name: 'Finanzas', component: MoneyIcon, value: 'MoneyIcon' },
  { name: 'Inventario', component: InventoryIcon, value: 'InventoryIcon' },
  { name: 'Envíos', component: ShippingIcon, value: 'ShippingIcon' },
  { name: 'Analíticas', component: AnalyticsIcon, value: 'AnalyticsIcon' },
  { name: 'Soporte', component: SupportIcon, value: 'SupportIcon' },
  { name: 'Email', component: EmailIcon, value: 'EmailIcon' },
  { name: 'Eventos', component: EventIcon, value: 'EventIcon' },
  { name: 'Archivos', component: FileIcon, value: 'FileIcon' },
  { name: 'Módulo', component: ModuleIcon, value: 'ModuleIcon' },
  { name: 'Carpeta', component: FolderIcon, value: 'FolderIcon' }
];

const ModuleManagement: React.FC = () => {
  const { user } = useAuthStore();
  const { showSuccess, showError } = useNotifications();
  
  // Estados
  const [modules, setModules] = useState<Module[]>([]);
  const [flatModules, setFlatModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Paginación
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  
  // Filtros
  const [filter, setFilter] = useState<ModuleFilter>({
    searchText: '',
    parentId: '',
    status: 'all',
    sortBy: 'order',
    sortOrder: 'asc'
  });
  
  // Vista
  const [viewMode, setViewMode] = useState<'table' | 'tree'>('table');
  
  // Diálogos
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [iconDialogOpen, setIconDialogOpen] = useState(false);
  
  // Estados de formulario
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    route: '',
    icon: 'ModuleIcon',
    parentId: '',
    order: 0,
    isVisible: true,
    requiredRole: ''
  });
  
  // Menú de acciones
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [actionModule, setActionModule] = useState<Module | null>(null);

  // Cargar módulos
  const loadModules = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await moduleRepository.getAllModules();
      
      // Crear una lista plana para filtrado y búsqueda
      let filteredModules = [...result];
      
      if (filter.searchText) {
        const searchLower = filter.searchText.toLowerCase();
        filteredModules = filteredModules.filter(module =>
          module.code.toLowerCase().includes(searchLower) ||
          module.name.toLowerCase().includes(searchLower) ||
          module.description?.toLowerCase().includes(searchLower) ||
          module.route?.toLowerCase().includes(searchLower)
        );
      }
      
      if (filter.parentId) {
        filteredModules = filteredModules.filter(module => 
          module.parentId === filter.parentId
        );
      }
      
      if (filter.status !== 'all') {
        const isActive = filter.status === 'active';
        filteredModules = filteredModules.filter(module => module.isVisible === isActive);
      }
      
      // Ordenar
      filteredModules.sort((a, b) => {
        let valueA: any, valueB: any;
        
        switch (filter.sortBy) {
          case 'name':
            valueA = a.name.toLowerCase();
            valueB = b.name.toLowerCase();
            break;
          case 'route':
            valueA = a.route?.toLowerCase() || '';
            valueB = b.route?.toLowerCase() || '';
            break;
          case 'order':
            valueA = a.order;
            valueB = b.order;
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
            valueA = a.order;
            valueB = b.order;
        }
        
        if (filter.sortOrder === 'asc') {
          return valueA > valueB ? 1 : -1;
        } else {
          return valueA < valueB ? 1 : -1;
        }
      });
      
      setFlatModules(filteredModules);
      setTotalCount(filteredModules.length);
      
      // Para la vista de tabla, aplicar paginación
      if (viewMode === 'table') {
        const startIndex = page * rowsPerPage;
        const paginatedModules = filteredModules.slice(startIndex, startIndex + rowsPerPage);
        setModules(paginatedModules);
      } else {
        // Para la vista de árbol, mantener estructura jerárquica
        setModules(buildModuleTree(result));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error loading modules';
      setError(errorMessage);
      showError('Error al cargar módulos', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Construir árbol de módulos
  const buildModuleTree = (modules: Module[]): Module[] => {
    const moduleMap = new Map<string, Module & { children: Module[] }>();
    
    // Crear mapa con todos los módulos
    modules.forEach(module => {
      moduleMap.set(module.moduleId, { ...module, children: [] });
    });
    
    const tree: Module[] = [];
    
    // Construir jerarquía
    modules.forEach(module => {
      const moduleWithChildren = moduleMap.get(module.moduleId)!;
      
      if (module.parentId) {
        const parent = moduleMap.get(module.parentId);
        if (parent) {
          parent.children.push(moduleWithChildren);
        } else {
          tree.push(moduleWithChildren);
        }
      } else {
        tree.push(moduleWithChildren);
      }
    });
    
    return tree;
  };

  // Efectos
  useEffect(() => {
    loadModules();
  }, [page, rowsPerPage, filter, viewMode]);

  // Handlers de paginación
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handlers de filtros
  const handleFilterChange = (newFilter: Partial<ModuleFilter>) => {
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
      code: '',
      name: '',
      description: '',
      route: '',
      icon: 'ModuleIcon',
      parentId: '',
      order: 0,
      isVisible: true,
      requiredRole: ''
    });
    setCreateDialogOpen(true);
  };

  const handleEditClick = (module: Module) => {
    setSelectedModule(module);
    setFormData({
      code: module.code,
      name: module.name,
      description: module.description || '',
      route: module.route || '',
      icon: module.icon || 'ModuleIcon',
      parentId: module.parentId || '',
      order: module.order,
      isVisible: module.isVisible,
      requiredRole: module.requiredRole || ''
    });
    setEditDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteClick = (module: Module) => {
    setSelectedModule(module);
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleHistoryClick = (module: Module) => {
    setSelectedModule(module);
    setHistoryDialogOpen(true);
    handleMenuClose();
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, module: Module) => {
    setAnchorEl(event.currentTarget);
    setActionModule(module);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setActionModule(null);
  };

  // Handlers de formulario
  const handleFormChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCreateSubmit = async () => {
    try {
      if (!user?.id) {
        showError('Usuario no autenticado');
        return;
      }

      // Validar campos requeridos
      if (!formData.code || !formData.name) {
        showError('El código y nombre son requeridos');
        return;
      }

      await moduleRepository.create({
        code: formData.code,
        name: formData.name,
        description: formData.description,
        route: formData.route,
        icon: formData.icon,
        parentId: formData.parentId || undefined,
        order: formData.order,
        isVisible: formData.isVisible,
        isActive: true,
        requiredRole: formData.requiredRole
      }, user.id);

      showSuccess('Módulo creado exitosamente');
      setCreateDialogOpen(false);
      loadModules();
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Error al crear módulo');
    }
  };

  const handleEditSubmit = async () => {
    try {
      if (!user?.id || !selectedModule) {
        showError('Usuario no autenticado o módulo no seleccionado');
        return;
      }

      // Validar campos requeridos
      if (!formData.code || !formData.name) {
        showError('El código y nombre son requeridos');
        return;
      }

      await moduleRepository.update(selectedModule.moduleId, {
        code: formData.code,
        name: formData.name,
        description: formData.description,
        route: formData.route,
        icon: formData.icon,
        parentId: formData.parentId || undefined,
        order: formData.order,
        isVisible: formData.isVisible,
        requiredRole: formData.requiredRole
      }, user.id);

      showSuccess('Módulo actualizado exitosamente');
      setEditDialogOpen(false);
      loadModules();
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Error al actualizar módulo');
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      if (!user?.id || !selectedModule) {
        showError('Usuario no autenticado o módulo no seleccionado');
        return;
      }

      await moduleRepository.delete(selectedModule.moduleId, user.id);
      showSuccess('Módulo eliminado exitosamente');
      setDeleteDialogOpen(false);
      loadModules();
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Error al eliminar módulo');
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

  const getIconComponent = (iconName: string | undefined) => {
    if (!iconName) return ModuleIcon;
    const icon = AVAILABLE_ICONS.find(i => i.value === iconName);
    return icon ? icon.component : ModuleIcon;
  };

  const getParentModuleName = (parentId: string) => {
    const parent = flatModules.find(m => m.moduleId === parentId);
    return parent ? parent.name : 'Módulo raíz';
  };

  // Renderizar módulos en lista jerárquica
  const renderHierarchicalList = (modules: any[], level = 0): React.ReactNode => {
    return modules.map((module) => (
      <Box key={module.moduleId}>
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1, 
            py: 1, 
            pl: level * 3,
            borderLeft: level > 0 ? '2px solid #e0e0e0' : 'none'
          }}
        >
          {React.createElement(getIconComponent(module.icon), { fontSize: 'small' })}
          <Typography variant="body2">{module.name}</Typography>
          <Chip 
            label={module.isVisible ? 'Visible' : 'Oculto'}
            size="small"
            color={module.isVisible ? 'success' : 'default'}
          />
          <IconButton
            size="small"
            onClick={(e) => handleMenuClick(e, module)}
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </Box>
        {module.children && module.children.length > 0 && renderHierarchicalList(module.children, level + 1)}
      </Box>
    ));
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ModuleIcon color="primary" />
          Administración de Módulos
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Gestiona los módulos y su jerarquía con personalización de iconos y registro de auditoría
        </Typography>
      </Box>

      {/* Controles */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Búsqueda */}
            <TextField
              placeholder="Buscar módulos..."
              variant="outlined"
              size="small"
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
              }}
              sx={{ minWidth: 250 }}
            />
            
            {/* Filtro por padre */}
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel>Módulo padre</InputLabel>
              <Select
                value={filter.parentId}
                label="Módulo padre"
                onChange={(e) => handleFilterChange({ parentId: e.target.value })}
              >
                <MenuItem value="">Todos los niveles</MenuItem>
                <MenuItem value="root">Módulos raíz</MenuItem>
                {flatModules
                  .filter(m => !m.parentId)
                  .map((module) => (
                    <MenuItem key={module.moduleId} value={module.moduleId}>
                      {module.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            
            {/* Filtro de estado */}
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Estado</InputLabel>
              <Select
                value={filter.status}
                label="Estado"
                onChange={(e) => handleFilterChange({ status: e.target.value as any })}
              >
                <MenuItem value="all">Todos</MenuItem>
                <MenuItem value="active">Visibles</MenuItem>
                <MenuItem value="inactive">Ocultos</MenuItem>
              </Select>
            </FormControl>
            
            {/* Vista */}
            <FormControl size="small" sx={{ minWidth: 100 }}>
              <InputLabel>Vista</InputLabel>
              <Select
                value={viewMode}
                label="Vista"
                onChange={(e) => setViewMode(e.target.value as 'table' | 'tree')}
              >
                <MenuItem value="table">Tabla</MenuItem>
                <MenuItem value="tree">Árbol</MenuItem>
              </Select>
            </FormControl>
            
            <Box sx={{ flexGrow: 1 }} />
            
            {/* Botón crear */}
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateClick}
            >
              Nuevo Módulo
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

      {/* Vista de tabla */}
      {viewMode === 'table' && (
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Módulo</TableCell>
                  <TableCell>Ruta</TableCell>
                  <TableCell>Padre</TableCell>
                  <TableCell>Orden</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Última modificación</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {modules.map((module) => {
                  const IconComponent = getIconComponent(module.icon);
                  return (
                    <TableRow key={module.moduleId} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <IconComponent color="primary" />
                          <Box>
                            <Typography variant="subtitle2" fontWeight={600}>
                              {module.name}
                            </Typography>
                            {module.description && (
                              <Typography variant="caption" color="text.secondary">
                                {module.description}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                          {module.route || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {module.parentId ? getParentModuleName(module.parentId) : 'Raíz'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={module.order} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={module.isVisible ? 'Visible' : 'Oculto'}
                          color={module.isVisible ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(module.updatedAt)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuClick(e, module)}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
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
      )}

      {/* Vista de árbol */}
      {viewMode === 'tree' && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Estructura Jerárquica de Módulos
            </Typography>
            <Box sx={{ minHeight: 400 }}>
              {renderHierarchicalList(modules)}
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Menú de acciones */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => actionModule && handleEditClick(actionModule)}>
          <EditIcon sx={{ mr: 1 }} fontSize="small" />
          Editar
        </MenuItem>
        <MenuItem onClick={() => actionModule && handleHistoryClick(actionModule)}>
          <HistoryIcon sx={{ mr: 1 }} fontSize="small" />
          Ver historial
        </MenuItem>
        <Divider />
        <MenuItem 
          onClick={() => actionModule && handleDeleteClick(actionModule)}
          sx={{ color: 'error.main' }}
        >
          <DeleteIcon sx={{ mr: 1 }} fontSize="small" />
          Eliminar
        </MenuItem>
      </Menu>

      {/* Diálogo de creación/edición */}
      <Dialog
        open={createDialogOpen || editDialogOpen}
        onClose={() => {
          setCreateDialogOpen(false);
          setEditDialogOpen(false);
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {createDialogOpen ? 'Nuevo Módulo' : 'Editar Módulo'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Código del módulo"
              value={formData.code}
              onChange={(e) => handleFormChange('code', e.target.value.toUpperCase())}
              placeholder="ADMIN, HR.EMPLOYEES"
              required
              fullWidth
              helperText="Código único para identificar el módulo (ej: ADMIN, HR.EMPLOYEES)"
            />
            
            <TextField
              label="Nombre del módulo"
              value={formData.name}
              onChange={(e) => handleFormChange('name', e.target.value)}
              required
              fullWidth
            />
            
            <TextField
              label="Descripción"
              value={formData.description}
              onChange={(e) => handleFormChange('description', e.target.value)}
              multiline
              rows={2}
              fullWidth
            />
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Ruta"
                value={formData.route}
                onChange={(e) => handleFormChange('route', e.target.value)}
                placeholder="/ruta-del-modulo"
                fullWidth
              />
              
              <TextField
                label="Orden"
                type="number"
                value={formData.order}
                onChange={(e) => handleFormChange('order', parseInt(e.target.value) || 0)}
                fullWidth
              />
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <FormControl fullWidth>
                <InputLabel>Icono</InputLabel>
                <Select
                  value={formData.icon}
                  label="Icono"
                  onChange={(e) => handleFormChange('icon', e.target.value)}
                  renderValue={(value) => (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {React.createElement(getIconComponent(value), { fontSize: 'small' })}
                      <Typography>
                        {AVAILABLE_ICONS.find(i => i.value === value)?.name || value}
                      </Typography>
                    </Box>
                  )}
                >
                  {AVAILABLE_ICONS.map((icon) => (
                    <MenuItem key={icon.value} value={icon.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <icon.component fontSize="small" />
                        <Typography>{icon.name}</Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl fullWidth>
                <InputLabel>Módulo padre</InputLabel>
                <Select
                  value={formData.parentId}
                  label="Módulo padre"
                  onChange={(e) => handleFormChange('parentId', e.target.value)}
                >
                  <MenuItem value="">Módulo raíz</MenuItem>
                  {flatModules
                    .filter(m => !m.parentId && m.moduleId !== selectedModule?.moduleId)
                    .map((module) => (
                      <MenuItem key={module.moduleId} value={module.moduleId}>
                        {module.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <FormControl component="fieldset">
                <Typography variant="body2">
                  <input
                    type="checkbox"
                    checked={formData.isVisible}
                    onChange={(e) => handleFormChange('isVisible', e.target.checked)}
                  />
                  {' '}Módulo visible
                </Typography>
              </FormControl>
              
              <TextField
                label="Rol requerido"
                value={formData.requiredRole}
                onChange={(e) => handleFormChange('requiredRole', e.target.value)}
                placeholder="admin, user, etc."
                fullWidth
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setCreateDialogOpen(false);
            setEditDialogOpen(false);
          }}>
            Cancelar
          </Button>
          <Button 
            onClick={createDialogOpen ? handleCreateSubmit : handleEditSubmit}
            variant="contained"
            disabled={!formData.code.trim() || !formData.name.trim()}
          >
            {createDialogOpen ? 'Crear Módulo' : 'Guardar Cambios'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de eliminación */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Eliminar Módulo</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro que deseas eliminar el módulo "{selectedModule?.name}"? 
            Esta acción también eliminará todos sus submódulos.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
          >
            Eliminar
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
          Historial de Cambios - {selectedModule?.name}
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

export default ModuleManagement;