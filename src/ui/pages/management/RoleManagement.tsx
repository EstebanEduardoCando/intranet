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
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Switch,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Search as SearchIcon,
  History as HistoryIcon,
  Security as SecurityIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';
import { Role } from '../../../domain/role/Role';
import { UpdateRolePermissionsData } from '../../../domain/role/RolePermission';
import { Module } from '../../../domain/modules/Module';
import { GetRoles } from '../../../application/role/GetRoles';
import { GetModules } from '../../../application/modules/GetModules';
import { SupabaseRoleRepository } from '../../../infrastructure/supabase/SupabaseRoleRepository';
import { SupabaseModuleRepository } from '../../../infrastructure/supabase/SupabaseModuleRepository';
import { useNotifications } from '../../contexts/NotificationContext';
import { useAuthStore } from '../../store/useAuth';

// Dependency injection
const roleRepository = new SupabaseRoleRepository();
const getRoles = new GetRoles(roleRepository);
const moduleRepository = new SupabaseModuleRepository();
const getModules = new GetModules(moduleRepository);

interface RoleFilter {
  searchText: string;
  status: 'all' | 'active' | 'inactive';
  sortBy: 'name' | 'created_at' | 'updated_at';
  sortOrder: 'asc' | 'desc';
}

// Permisos disponibles del sistema
const AVAILABLE_PERMISSIONS = [
  { id: 'users:read', name: 'Ver usuarios', category: 'Usuarios' },
  { id: 'users:write', name: 'Gestionar usuarios', category: 'Usuarios' },
  { id: 'users:delete', name: 'Eliminar usuarios', category: 'Usuarios' },
  { id: 'companies:read', name: 'Ver empresas', category: 'Empresas' },
  { id: 'companies:write', name: 'Gestionar empresas', category: 'Empresas' },
  { id: 'companies:delete', name: 'Eliminar empresas', category: 'Empresas' },
  { id: 'positions:read', name: 'Ver cargos', category: 'Cargos' },
  { id: 'positions:write', name: 'Gestionar cargos', category: 'Cargos' },
  { id: 'positions:delete', name: 'Eliminar cargos', category: 'Cargos' },
  { id: 'roles:read', name: 'Ver roles', category: 'Roles' },
  { id: 'roles:write', name: 'Gestionar roles', category: 'Roles' },
  { id: 'roles:delete', name: 'Eliminar roles', category: 'Roles' },
  { id: 'modules:read', name: 'Ver módulos', category: 'Módulos' },
  { id: 'modules:write', name: 'Gestionar módulos', category: 'Módulos' },
  { id: 'modules:delete', name: 'Eliminar módulos', category: 'Módulos' },
  { id: 'audit:read', name: 'Ver auditoría', category: 'Auditoría' },
  { id: 'settings:read', name: 'Ver configuración', category: 'Sistema' },
  { id: 'settings:write', name: 'Gestionar configuración', category: 'Sistema' }
];

const RoleManagement: React.FC = () => {
  const { user } = useAuthStore();
  const { showSuccess, showError } = useNotifications();
  
  // Estados
  const [roles, setRoles] = useState<Role[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Paginación
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  
  // Filtros
  const [filter, setFilter] = useState<RoleFilter>({
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
  const [permissionsDialogOpen, setPermissionsDialogOpen] = useState(false);
  
  // Estados de formulario
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: [] as string[]
  });
  
  // Permisos de módulos para el rol seleccionado
  const [modulePermissions, setModulePermissions] = useState<Map<string, {
    canView: boolean;
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canExecute: boolean;
  }>>(new Map());
  
  // Menú de acciones
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [actionRole, setActionRole] = useState<Role | null>(null);

  // Cargar módulos
  const loadModules = async () => {
    try {
      const result = await getModules.execute();
      setModules(result);
    } catch (error) {
      console.error('Error loading modules:', error);
    }
  };

  // Cargar roles
  const loadRoles = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getRoles.execute();
      
      // Aplicar filtros localmente
      let filteredRoles = result;
      
      if (filter.searchText) {
        const searchLower = filter.searchText.toLowerCase();
        filteredRoles = filteredRoles.filter(role =>
          role.name.toLowerCase().includes(searchLower) ||
          role.description?.toLowerCase().includes(searchLower)
        );
      }
      
      if (filter.status !== 'all') {
        const isActive = filter.status === 'active';
        filteredRoles = filteredRoles.filter(role => !role.isDeleted === isActive);
      }
      
      // Ordenar
      filteredRoles.sort((a, b) => {
        let valueA: any, valueB: any;
        
        switch (filter.sortBy) {
          case 'name':
            valueA = a.name.toLowerCase();
            valueB = b.name.toLowerCase();
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
            valueA = a.name.toLowerCase();
            valueB = b.name.toLowerCase();
        }
        
        if (filter.sortOrder === 'asc') {
          return valueA > valueB ? 1 : -1;
        } else {
          return valueA < valueB ? 1 : -1;
        }
      });
      
      setTotalCount(filteredRoles.length);
      
      // Aplicar paginación
      const startIndex = page * rowsPerPage;
      const paginatedRoles = filteredRoles.slice(startIndex, startIndex + rowsPerPage);
      
      setRoles(paginatedRoles);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error loading roles';
      setError(errorMessage);
      showError('Error al cargar roles', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Efectos
  useEffect(() => {
    loadModules();
  }, []);

  useEffect(() => {
    loadRoles();
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
  const handleFilterChange = (newFilter: Partial<RoleFilter>) => {
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
      permissions: []
    });
    setCreateDialogOpen(true);
  };

  const handleEditClick = (role: Role) => {
    setSelectedRole(role);
    setFormData({
      name: role.name,
      description: role.description || '',
      permissions: role.permissions || []
    });
    setEditDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteClick = (role: Role) => {
    setSelectedRole(role);
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleHistoryClick = (role: Role) => {
    setSelectedRole(role);
    setHistoryDialogOpen(true);
    handleMenuClose();
  };

  const handlePermissionsClick = async (role: Role) => {
    setSelectedRole(role);
    setFormData({
      name: role.name,
      description: role.description || '',
      permissions: role.permissions || []
    });
    
    // Cargar permisos existentes del rol
    try {
      const existingPermissions = await roleRepository.getModulePermissions(role.roleId);
      const permissionsMap = new Map();
      
      // Inicializar con permisos por defecto (false)
      modules.forEach(module => {
        permissionsMap.set(module.moduleId, {
          canView: false,
          canCreate: false,
          canEdit: false,
          canDelete: false,
          canExecute: false
        });
      });
      
      // Sobrescribir con permisos existentes
      existingPermissions.forEach(permission => {
        permissionsMap.set(permission.moduleId, {
          canView: permission.canView,
          canCreate: permission.canCreate,
          canEdit: permission.canEdit,
          canDelete: permission.canDelete,
          canExecute: permission.canExecute
        });
      });
      
      setModulePermissions(permissionsMap);
    } catch (error) {
      console.error('Error loading permissions:', error);
      showError('Error al cargar permisos');
    }
    
    setPermissionsDialogOpen(true);
    handleMenuClose();
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, role: Role) => {
    setAnchorEl(event.currentTarget);
    setActionRole(role);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setActionRole(null);
  };

  // Handlers de formulario
  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePermissionToggle = (permissionId: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(p => p !== permissionId)
        : [...prev.permissions, permissionId]
    }));
  };

  // Manejar cambios en permisos de módulo
  const handleModulePermissionChange = (moduleId: string, permission: string, value: boolean) => {
    setModulePermissions(prev => {
      const newMap = new Map(prev);
      const modulePerms = newMap.get(moduleId) || {
        canView: false,
        canCreate: false,
        canEdit: false,
        canDelete: false,
        canExecute: false
      };
      
      newMap.set(moduleId, {
        ...modulePerms,
        [permission]: value
      });
      
      return newMap;
    });
  };

  const handleCreateSubmit = async () => {
    try {
      if (!user?.id) {
        showError('Usuario no autenticado');
        return;
      }

      // Validar campos requeridos
      if (!formData.name.trim()) {
        showError('El nombre del rol es requerido');
        return;
      }

      await roleRepository.create({
        name: formData.name.trim(),
        description: formData.description.trim() || undefined
      }, user.id);

      showSuccess('Rol creado exitosamente');
      setCreateDialogOpen(false);
      loadRoles();
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Error al crear rol');
    }
  };

  const handleEditSubmit = async () => {
    try {
      if (!user?.id || !selectedRole) {
        showError('Usuario no autenticado o rol no seleccionado');
        return;
      }

      // Validar campos requeridos
      if (!formData.name.trim()) {
        showError('El nombre del rol es requerido');
        return;
      }

      await roleRepository.update(selectedRole.roleId, {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined
      }, user.id);

      showSuccess('Rol actualizado exitosamente');
      setEditDialogOpen(false);
      loadRoles();
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Error al actualizar rol');
    }
  };

  const handlePermissionsSubmit = async () => {
    try {
      if (!user?.id || !selectedRole) {
        showError('Usuario no autenticado o rol no seleccionado');
        return;
      }

      // Construir datos de permisos
      const modulePermissionsData = Array.from(modulePermissions.entries()).map(([moduleId, permissions]) => ({
        moduleId,
        canView: permissions.canView,
        canCreate: permissions.canCreate,
        canEdit: permissions.canEdit,
        canDelete: permissions.canDelete,
        canExecute: permissions.canExecute
      }));

      const permissionUpdateData: UpdateRolePermissionsData = {
        roleId: selectedRole.roleId,
        modulePermissions: modulePermissionsData,
        functionPermissions: [] // Por ahora solo manejamos módulos
      };

      await roleRepository.updatePermissions(permissionUpdateData, user.id);
      
      showSuccess('Permisos actualizados exitosamente');
      setPermissionsDialogOpen(false);
      loadRoles();
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Error al actualizar permisos');
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      if (!user?.id || !selectedRole) {
        showError('Usuario no autenticado o rol no seleccionado');
        return;
      }

      await roleRepository.delete(selectedRole.roleId, user.id);
      showSuccess('Rol eliminado exitosamente');
      setDeleteDialogOpen(false);
      loadRoles();
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Error al eliminar rol');
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

  const getPermissionsByCategory = () => {
    const categories: Record<string, typeof AVAILABLE_PERMISSIONS> = {};
    AVAILABLE_PERMISSIONS.forEach(permission => {
      if (!categories[permission.category]) {
        categories[permission.category] = [];
      }
      categories[permission.category].push(permission);
    });
    return categories;
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SecurityIcon color="primary" />
          Administración de Roles
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Gestiona los roles y permisos del sistema con registro completo de auditoría
        </Typography>
      </Box>

      {/* Controles */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Búsqueda */}
            <TextField
              placeholder="Buscar roles..."
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
              Nuevo Rol
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
                <TableCell>Rol</TableCell>
                <TableCell>Permisos</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Última modificación</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {roles.map((role) => (
                <TableRow key={role.roleId} hover>
                  <TableCell>
                    <Box>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {role.name}
                      </Typography>
                      {role.description && (
                        <Typography variant="caption" color="text.secondary">
                          {role.description}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AssignmentIcon fontSize="small" color="action" />
                      <Typography variant="body2">
                        {role.permissions?.length || 0} permisos
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={role.isDeleted ? 'Inactivo' : 'Activo'}
                      color={role.isDeleted ? 'error' : 'success'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatDate(role.updatedAt)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuClick(e, role)}
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
        <MenuItem onClick={() => actionRole && handleEditClick(actionRole)}>
          <EditIcon sx={{ mr: 1 }} fontSize="small" />
          Editar
        </MenuItem>
        <MenuItem onClick={() => actionRole && handlePermissionsClick(actionRole)}>
          <AssignmentIcon sx={{ mr: 1 }} fontSize="small" />
          Gestionar permisos
        </MenuItem>
        <MenuItem onClick={() => actionRole && handleHistoryClick(actionRole)}>
          <HistoryIcon sx={{ mr: 1 }} fontSize="small" />
          Ver historial
        </MenuItem>
        <Divider />
        <MenuItem 
          onClick={() => actionRole && handleDeleteClick(actionRole)}
          sx={{ color: 'error.main' }}
        >
          <DeleteIcon sx={{ mr: 1 }} fontSize="small" />
          {actionRole?.isDeleted ? 'Restaurar' : 'Eliminar'}
        </MenuItem>
      </Menu>

      {/* Diálogo de creación */}
      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Nuevo Rol</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Nombre del rol"
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
            Crear Rol
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
        <DialogTitle>Editar Rol</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Nombre del rol"
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

      {/* Diálogo de permisos */}
      <Dialog
        open={permissionsDialogOpen}
        onClose={() => setPermissionsDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Gestionar Permisos - {selectedRole?.name}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Selecciona los permisos CRUD que tendrá este rol para cada módulo
          </Typography>
          
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Módulo</TableCell>
                  <TableCell align="center">Ver</TableCell>
                  <TableCell align="center">Crear</TableCell>
                  <TableCell align="center">Editar</TableCell>
                  <TableCell align="center">Eliminar</TableCell>
                  <TableCell align="center">Ejecutar</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {modules.map((module) => {
                  const permissions = modulePermissions.get(module.moduleId) || {
                    canView: false,
                    canCreate: false,
                    canEdit: false,
                    canDelete: false,
                    canExecute: false
                  };
                  
                  return (
                    <TableRow key={module.moduleId}>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {module.name}
                        </Typography>
                        {module.description && (
                          <Typography variant="caption" color="text.secondary" display="block">
                            {module.description}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <Checkbox
                          checked={permissions.canView}
                          onChange={(e) => handleModulePermissionChange(module.moduleId, 'canView', e.target.checked)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Checkbox
                          checked={permissions.canCreate}
                          onChange={(e) => handleModulePermissionChange(module.moduleId, 'canCreate', e.target.checked)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Checkbox
                          checked={permissions.canEdit}
                          onChange={(e) => handleModulePermissionChange(module.moduleId, 'canEdit', e.target.checked)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Checkbox
                          checked={permissions.canDelete}
                          onChange={(e) => handleModulePermissionChange(module.moduleId, 'canDelete', e.target.checked)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Checkbox
                          checked={permissions.canExecute}
                          onChange={(e) => handleModulePermissionChange(module.moduleId, 'canExecute', e.target.checked)}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPermissionsDialogOpen(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handlePermissionsSubmit}
            variant="contained"
          >
            Guardar Permisos
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de eliminación */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>
          {selectedRole?.isDeleted ? 'Restaurar Rol' : 'Eliminar Rol'}
        </DialogTitle>
        <DialogContent>
          <Typography>
            {selectedRole?.isDeleted 
              ? `¿Estás seguro que deseas restaurar el rol "${selectedRole?.name}"?`
              : `¿Estás seguro que deseas eliminar el rol "${selectedRole?.name}"? Esta acción se puede revertir posteriormente.`
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
            color={selectedRole?.isDeleted ? 'primary' : 'error'}
          >
            {selectedRole?.isDeleted ? 'Restaurar' : 'Eliminar'}
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
          Historial de Cambios - {selectedRole?.name}
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

export default RoleManagement;