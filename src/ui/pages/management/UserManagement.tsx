import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  Container,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  Divider,
  Grid,
} from '@mui/material';
import { useNotifications } from '../../contexts/NotificationContext';
import {
  Add as AddIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PersonAdd as PersonAddIcon,
  Business as BusinessIcon,
  Work as WorkIcon,
  Security as SecurityIcon,
  FilterList as FilterListIcon
} from '@mui/icons-material';
import { getPersonDisplayName } from '../../../domain/user/Person';
import { User } from '../../../domain/user/User';
import { Company } from '../../../domain/company/Company';
import { Position } from '../../../domain/position/Position';
import { Role } from '../../../domain/role/Role';
import { GetUsers } from '../../../application/user/GetUsers';
import { DeleteUser } from '../../../application/user/DeleteUser';
import { ManageUserRoles } from '../../../application/user/ManageUserRoles';
import { UpdateUserProfile } from '../../../application/user/UpdateUserProfile';
import { RegisterUser } from '../../../application/auth/RegisterUser';
import { AssignUserCompanyAndPosition } from '../../../application/user/AssignUserCompanyAndPosition';
import { GetCompanies } from '../../../application/company/GetCompanies';
import { GetPositions } from '../../../application/position/GetPositions';
import { GetRoles } from '../../../application/role/GetRoles';
import { SupabaseUserRepository } from '../../../infrastructure/supabase/SupabaseUserRepository';
import { SupabasePersonRepository } from '../../../infrastructure/supabase/SupabasePersonRepository';
import { SupabaseUserProfileRepository } from '../../../infrastructure/supabase/SupabaseUserProfileRepository';
import { SupabaseCompanyRepository } from '../../../infrastructure/supabase/SupabaseCompanyRepository';
import { SupabasePositionRepository } from '../../../infrastructure/supabase/SupabasePositionRepository';
import { SupabaseRoleRepository } from '../../../infrastructure/supabase/SupabaseRoleRepository';
import { SupabaseAuthService } from '../../../infrastructure/supabase/SupabaseAuthService';

// Initialize repositories and use cases
const userRepository = new SupabaseUserRepository();
const personRepository = new SupabasePersonRepository();
const userProfileRepository = new SupabaseUserProfileRepository();
const companyRepository = new SupabaseCompanyRepository();
const positionRepository = new SupabasePositionRepository();
const roleRepository = new SupabaseRoleRepository();
const authService = new SupabaseAuthService();

const getUsers = new GetUsers(userRepository);
const deleteUser = new DeleteUser(userRepository);
const manageUserRoles = new ManageUserRoles(userRepository, roleRepository);
const updateUserProfile = new UpdateUserProfile(personRepository, userProfileRepository);
const getCompanies = new GetCompanies(companyRepository);
const getPositions = new GetPositions(positionRepository);
const getRoles = new GetRoles(roleRepository);
const registerUser = new RegisterUser(authService);
const assignUserCompanyAndPosition = new AssignUserCompanyAndPosition(userRepository, companyRepository, positionRepository);

const UserManagement: React.FC = () => {
  const { showError, showSuccess } = useNotifications();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [newUserDialogOpen, setNewUserDialogOpen] = useState(false);
  const [editUserDialogOpen, setEditUserDialogOpen] = useState(false);
  const [assignCompanyPositionDialogOpen, setAssignCompanyPositionDialogOpen] = useState(false);
  const [manageRolesDialogOpen, setManageRolesDialogOpen] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  
  // Filter states
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [activeFilters, setActiveFilters] = useState({
    status: 'all', // 'all', 'active', 'inactive'
    company: 'all',
    position: 'all',
    role: 'all'
  });
  
  // New user form states
  const [newUserForm, setNewUserForm] = useState({
    email: '',
    password: '',
    firstName: '',
    middleName: '',
    lastName: '',
    secondLastName: '',
    identityType: 'CC',
    identityNumber: '',
    phone: '',
    username: ''
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  
  // Edit user form states
  const [editUserForm, setEditUserForm] = useState({
    email: '',
    firstName: '',
    middleName: '',
    lastName: '',
    secondLastName: '',
    identityType: 'CC',
    identityNumber: '',
    phone: '',
    username: ''
  });
  const [editFormErrors, setEditFormErrors] = useState<Record<string, string>>({});
  const [isUpdatingUser, setIsUpdatingUser] = useState(false);
  
  // Assignment form states
  const [selectedCompanyId, setSelectedCompanyId] = useState('');
  const [selectedPositionId, setSelectedPositionId] = useState('');
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([]);
  const [isAssigning, setIsAssigning] = useState(false);
  // Load users and related data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Load users with search and pagination
        const usersResponse = await getUsers.execute({
          page,
          limit: rowsPerPage,
          searchTerm: searchTerm || undefined
        });
        
        setUsers(usersResponse.users);
        setTotalUsers(usersResponse.total);
        
        // Load companies, positions, and roles for dropdowns
        const [companiesData, positionsData, rolesData] = await Promise.all([
          getCompanies.execute(),
          getPositions.execute(),
          getRoles.execute()
        ]);
        
        setCompanies(companiesData);
        setPositions(positionsData);
        setRoles(rolesData);
        
        // Show success notification on first successful load
        if (users.length === 0 && usersResponse.users.length > 0) {
          showSuccess('Base de datos conectada correctamente', 'Sistema Listo');
        }
        
      } catch (error) {
        showError(error instanceof Error ? error.message : 'Error al cargar datos');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [page, rowsPerPage, searchTerm]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0); // Reset to first page when searching
  };

  // Filter functions
  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleFilterChange = (filterType: keyof typeof activeFilters, value: string) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    setPage(0); // Reset to first page when filtering
  };

  const clearAllFilters = () => {
    setActiveFilters({
      status: 'all',
      company: 'all',
      position: 'all',
      role: 'all'
    });
    setPage(0);
  };

  const getActiveFilterCount = () => {
    return Object.values(activeFilters).filter(value => value !== 'all').length;
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, user: User) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    // Don't clear selectedUser here as it's needed for dialogs
  };

  const handleEdit = () => {
    if (!selectedUser) {
      showError('No hay usuario seleccionado para editar');
      return;
    }
    
    // Populate edit form with current user data
    setEditUserForm({
      email: selectedUser.email,
      firstName: selectedUser.person.firstName,
      middleName: selectedUser.person.middleName || '',
      lastName: selectedUser.person.lastName,
      secondLastName: selectedUser.person.secondLastName || '',
      identityType: selectedUser.person.identityType,
      identityNumber: selectedUser.person.identityNumber,
      phone: selectedUser.person.phone || '',
      username: selectedUser.profile.username || ''
    });
    
    setEditFormErrors({});
    setEditUserDialogOpen(true);
    handleMenuClose();
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const confirmDelete = async () => {
    if (!selectedUser) {
      return;
    }
    
    
    try {
      const result = await deleteUser.execute({ userId: selectedUser.id });
      
      if (result) {
        // Calculate if we need to adjust page after deletion
        const currentItemCount = filteredUsers.length;
        const isLastItemOnPage = currentItemCount === 1 && page > 0;
        const newPage = isLastItemOnPage ? page - 1 : page;
        
        
        // Refresh users list
        const usersResponse = await getUsers.execute({
          page: newPage,
          limit: rowsPerPage,
          searchTerm: searchTerm || undefined
        });
        
        
        setUsers(usersResponse.users);
        setTotalUsers(usersResponse.total);
        
        // Update page if needed
        if (newPage !== page) {
          setPage(newPage);
        }
        
        setDeleteDialogOpen(false);
        setSelectedUser(null);
        showSuccess('Usuario desactivado correctamente');
      } else {
        throw new Error('Delete operation failed');
      }
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Error al eliminar usuario');
      setDeleteDialogOpen(false);
      setSelectedUser(null);
    }
  };

  const handleAssignCompanyAndPosition = async () => {
    if (!selectedUser) return;
    
    setSelectedCompanyId(selectedUser.company?.companyId?.toString() || '');
    setSelectedPositionId(selectedUser.position?.positionId?.toString() || '');
    setAssignCompanyPositionDialogOpen(true);
    handleMenuClose();
  };

  const handleManageRoles = async () => {
    if (!selectedUser) return;
    
    setSelectedRoleIds(selectedUser.roles.map(role => role.roleId.toString()));
    setManageRolesDialogOpen(true);
    handleMenuClose();
  };

  const confirmAssignCompanyAndPosition = async () => {
    if (!selectedUser || !selectedCompanyId || !selectedPositionId) {
      showError('Debe seleccionar tanto empresa como cargo');
      return;
    }
    
    setIsAssigning(true);
    try {
      await assignUserCompanyAndPosition.execute({
        userId: selectedUser.id,
        companyId: parseInt(selectedCompanyId),
        positionId: parseInt(selectedPositionId)
      });
      
      // Refresh users list
      const usersResponse = await getUsers.execute({
        page,
        limit: rowsPerPage,
        searchTerm: searchTerm || undefined
      });
      
      setUsers(usersResponse.users);
      setTotalUsers(usersResponse.total);
      setAssignCompanyPositionDialogOpen(false);
      setSelectedUser(null);
      showSuccess('Empresa y cargo asignados correctamente');
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Error al asignar empresa y cargo');
    } finally {
      setIsAssigning(false);
    }
  };

  const confirmManageRoles = async () => {
    if (!selectedUser) {
      showError('No hay usuario seleccionado');
      return;
    }
    
    
    setIsAssigning(true);
    try {
      const roleIds = selectedRoleIds.map(id => parseInt(id));
      
      await manageUserRoles.execute({
        userId: selectedUser.id,
        roleIds
      });
      
      
      // Refresh users list
      const usersResponse = await getUsers.execute({
        page,
        limit: rowsPerPage,
        searchTerm: searchTerm || undefined
      });
      
      setUsers(usersResponse.users);
      setTotalUsers(usersResponse.total);
      setManageRolesDialogOpen(false);
      setSelectedUser(null);
      showSuccess('Roles actualizados correctamente');
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Error al gestionar roles');
    } finally {
      setIsAssigning(false);
    }
  };

  // New user form handlers
  const handleNewUserClick = () => {
    setNewUserDialogOpen(true);
    resetNewUserForm();
  };

  const resetNewUserForm = () => {
    setNewUserForm({
      email: '',
      password: '',
      firstName: '',
      middleName: '',
      lastName: '',
      secondLastName: '',
      identityType: 'CC',
      identityNumber: '',
      phone: '',
      username: ''
    });
    setFormErrors({});
  };

  const handleNewUserFormChange = (field: string, value: string) => {
    setNewUserForm(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear field error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateNewUserForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!newUserForm.email.trim()) {
      errors.email = 'Email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newUserForm.email)) {
      errors.email = 'Formato de email inválido';
    }

    if (!newUserForm.password.trim()) {
      errors.password = 'Contraseña es requerida';
    } else if (newUserForm.password.length < 8) {
      errors.password = 'Contraseña debe tener al menos 8 caracteres';
    }

    if (!newUserForm.firstName.trim()) {
      errors.firstName = 'Nombre es requerido';
    } else if (newUserForm.firstName.trim().length < 2) {
      errors.firstName = 'Nombre debe tener al menos 2 caracteres';
    }

    if (!newUserForm.lastName.trim()) {
      errors.lastName = 'Apellido es requerido';
    } else if (newUserForm.lastName.trim().length < 2) {
      errors.lastName = 'Apellido debe tener al menos 2 caracteres';
    }

    if (!newUserForm.identityNumber.trim()) {
      errors.identityNumber = 'Número de documento es requerido';
    } else if (newUserForm.identityNumber.trim().length < 3) {
      errors.identityNumber = 'Número de documento debe tener al menos 3 caracteres';
    }

    if (newUserForm.username && newUserForm.username.trim().length < 3) {
      errors.username = 'Usuario debe tener al menos 3 caracteres';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateUser = async () => {
    if (!validateNewUserForm()) {
      return;
    }

    setIsCreatingUser(true);
    
    try {
      const userData = {
        email: newUserForm.email.trim(),
        password: newUserForm.password,
        person: {
          firstName: newUserForm.firstName.trim(),
          middleName: newUserForm.middleName.trim() || undefined,
          lastName: newUserForm.lastName.trim(),
          secondLastName: newUserForm.secondLastName.trim() || undefined,
          identityType: newUserForm.identityType as any,
          identityNumber: newUserForm.identityNumber.trim(),
          phone: newUserForm.phone.trim() || undefined
        },
        username: newUserForm.username.trim() || undefined
      };

      await registerUser.execute(userData);
      
      // Refresh users list
      const usersResponse = await getUsers.execute({
        page: 0, // Reset to first page to see new user
        limit: rowsPerPage,
        searchTerm: searchTerm || undefined
      });
      
      setUsers(usersResponse.users);
      setTotalUsers(usersResponse.total);
      setPage(0); // Reset to first page
      
      setNewUserDialogOpen(false);
      resetNewUserForm();
      showSuccess('Usuario creado correctamente');
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Error al crear usuario');
    } finally {
      setIsCreatingUser(false);
    }
  };

  // Edit user functions
  const handleEditUserFormChange = (field: string, value: string) => {
    setEditUserForm(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear field error when user starts typing
    if (editFormErrors[field]) {
      setEditFormErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateEditUserForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!editUserForm.firstName.trim()) {
      errors.firstName = 'Nombre es requerido';
    } else if (editUserForm.firstName.trim().length < 2) {
      errors.firstName = 'Nombre debe tener al menos 2 caracteres';
    }

    if (!editUserForm.lastName.trim()) {
      errors.lastName = 'Apellido es requerido';
    } else if (editUserForm.lastName.trim().length < 2) {
      errors.lastName = 'Apellido debe tener al menos 2 caracteres';
    }

    if (!editUserForm.identityNumber.trim()) {
      errors.identityNumber = 'Número de documento es requerido';
    } else if (editUserForm.identityNumber.trim().length < 3) {
      errors.identityNumber = 'Número de documento debe tener al menos 3 caracteres';
    }

    if (editUserForm.username && editUserForm.username.trim().length < 3) {
      errors.username = 'Usuario debe tener al menos 3 caracteres';
    }

    setEditFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleUpdateUser = async () => {
    if (!selectedUser || !validateEditUserForm()) {
      return;
    }

    setIsUpdatingUser(true);
    
    try {
      const updateData = {
        person: {
          firstName: editUserForm.firstName.trim(),
          middleName: editUserForm.middleName.trim() || undefined,
          lastName: editUserForm.lastName.trim(),
          secondLastName: editUserForm.secondLastName.trim() || undefined,
          identityType: editUserForm.identityType as any,
          identityNumber: editUserForm.identityNumber.trim(),
          phone: editUserForm.phone.trim() || undefined
        },
        profile: {
          username: editUserForm.username.trim() || undefined
        }
      };

      await updateUserProfile.execute(selectedUser.id, updateData);
      
      // Refresh user list
      const usersResponse = await getUsers.execute({
        page,
        limit: rowsPerPage,
        searchTerm: searchTerm || undefined
      });
      
      setUsers(usersResponse.users);
      setTotalUsers(usersResponse.total);
      
      setEditUserDialogOpen(false);
      setSelectedUser(null);
      showSuccess('Usuario actualizado correctamente');
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Error al actualizar usuario');
    } finally {
      setIsUpdatingUser(false);
    }
  };

  const handleCancelEditUser = () => {
    setEditUserDialogOpen(false);
    setEditUserForm({
      email: '',
      firstName: '',
      middleName: '',
      lastName: '',
      secondLastName: '',
      identityType: 'CC',
      identityNumber: '',
      phone: '',
      username: ''
    });
    setEditFormErrors({});
    setSelectedUser(null);
  };

  // Filter users based on search term and filters (client-side)
  const filteredUsers = users.filter(user => {
    // Search term filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = (
        user.person.firstName.toLowerCase().includes(searchLower) ||
        user.person.lastName.toLowerCase().includes(searchLower) ||
        user.person.identityNumber.includes(searchTerm) ||
        user.email.toLowerCase().includes(searchLower) ||
        (user.profile.username && user.profile.username.toLowerCase().includes(searchLower))
      );
      if (!matchesSearch) return false;
    }

    // Status filter
    if (activeFilters.status !== 'all') {
      const isActive = user.profile.isActive;
      if (activeFilters.status === 'active' && !isActive) return false;
      if (activeFilters.status === 'inactive' && isActive) return false;
    }

    // Role filter
    if (activeFilters.role !== 'all') {
      const hasRole = user.roles.some(role => role.roleId.toString() === activeFilters.role);
      if (!hasRole) return false;
    }

    // Company filter
    if (activeFilters.company !== 'all') {
      const userCompanyId = user.company?.companyId?.toString();
      if (userCompanyId !== activeFilters.company) return false;
    }

    // Position filter
    if (activeFilters.position !== 'all') {
      const userPositionId = user.position?.positionId?.toString();
      if (userPositionId !== activeFilters.position) return false;
    }

    return true;
  });

  // Client-side pagination
  const paginatedUsers = filteredUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Container maxWidth={false}>
      <Box sx={{ py: 4 }}>

        {/* Actions Bar */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 2
            }}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flex: 1, minWidth: 300 }}>
                <TextField
                  placeholder="Buscar usuarios..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  size="small"
                  sx={{ flex: 1, maxWidth: 400 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  variant="outlined"
                  startIcon={<FilterListIcon />}
                  onClick={handleFilterClick}
                  sx={{ whiteSpace: 'nowrap' }}
                >
                  Filtros {getActiveFilterCount() > 0 && `(${getActiveFilterCount()})`}
                </Button>
                
                {/* Filter Menu */}
                <Menu
                  anchorEl={filterAnchorEl}
                  open={Boolean(filterAnchorEl)}
                  onClose={handleFilterClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  PaperProps={{
                    sx: { 
                      width: 280,
                      p: 2
                    }
                  }}
                >
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                      Filtros Avanzados
                    </Typography>
                    
                    {/* Status Filter */}
                    <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                      <InputLabel>Estado</InputLabel>
                      <Select
                        value={activeFilters.status}
                        label="Estado"
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                      >
                        <MenuItem value="all">Todos</MenuItem>
                        <MenuItem value="active">Activos</MenuItem>
                        <MenuItem value="inactive">Inactivos</MenuItem>
                      </Select>
                    </FormControl>

                    {/* Role Filter */}
                    <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                      <InputLabel>Rol</InputLabel>
                      <Select
                        value={activeFilters.role}
                        label="Rol"
                        onChange={(e) => handleFilterChange('role', e.target.value)}
                      >
                        <MenuItem value="all">Todos los Roles</MenuItem>
                        {roles.map((role) => (
                          <MenuItem key={role.roleId} value={role.roleId.toString()}>
                            {role.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    {/* Company Filter */}
                    <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                      <InputLabel>Empresa</InputLabel>
                      <Select
                        value={activeFilters.company}
                        label="Empresa"
                        onChange={(e) => handleFilterChange('company', e.target.value)}
                      >
                        <MenuItem value="all">Todas las Empresas</MenuItem>
                        {companies.map((company) => (
                          <MenuItem key={company.companyId} value={company.companyId.toString()}>
                            {company.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    {/* Position Filter */}
                    <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                      <InputLabel>Cargo</InputLabel>
                      <Select
                        value={activeFilters.position}
                        label="Cargo"
                        onChange={(e) => handleFilterChange('position', e.target.value)}
                      >
                        <MenuItem value="all">Todos los Cargos</MenuItem>
                        {positions.map((position) => (
                          <MenuItem key={position.positionId} value={position.positionId.toString()}>
                            {position.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <Divider sx={{ my: 1 }} />
                    
                    {/* Active Filters Display */}
                    {getActiveFilterCount() > 0 && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" sx={{ color: 'text.secondary', mb: 1, display: 'block' }}>
                          Filtros Activos:
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                          {activeFilters.status !== 'all' && (
                            <Chip 
                              label={`Estado: ${activeFilters.status === 'active' ? 'Activos' : 'Inactivos'}`}
                              size="small" 
                              onDelete={() => handleFilterChange('status', 'all')}
                            />
                          )}
                          {activeFilters.role !== 'all' && (
                            <Chip 
                              label={`Rol: ${roles.find(r => r.roleId.toString() === activeFilters.role)?.name}`}
                              size="small" 
                              onDelete={() => handleFilterChange('role', 'all')}
                            />
                          )}
                          {activeFilters.company !== 'all' && (
                            <Chip 
                              label={`Empresa: ${companies.find(c => c.companyId.toString() === activeFilters.company)?.name}`}
                              size="small" 
                              onDelete={() => handleFilterChange('company', 'all')}
                            />
                          )}
                          {activeFilters.position !== 'all' && (
                            <Chip 
                              label={`Cargo: ${positions.find(p => p.positionId.toString() === activeFilters.position)?.name}`}
                              size="small" 
                              onDelete={() => handleFilterChange('position', 'all')}
                            />
                          )}
                        </Box>
                      </Box>
                    )}
                    
                    {/* Clear All Filters Button */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Button
                        size="small"
                        onClick={clearAllFilters}
                        disabled={getActiveFilterCount() === 0}
                      >
                        Limpiar Todo
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        onClick={handleFilterClose}
                      >
                        Aplicar
                      </Button>
                    </Box>
                  </Box>
                </Menu>
              </Box>
              
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleNewUserClick}
                sx={{ whiteSpace: 'nowrap' }}
              >
                Nuevo Usuario
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardContent sx={{ p: 0 }}>
            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Usuario</TableCell>
                        <TableCell>Documento</TableCell>
                        <TableCell>Empresa</TableCell>
                        <TableCell>Cargo</TableCell>
                        <TableCell>Roles</TableCell>
                        <TableCell>Estado</TableCell>
                        <TableCell>Fecha Registro</TableCell>
                        <TableCell align="center">Acciones</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedUsers.map((user) => (
                        <TableRow key={user.id} hover>
                          <TableCell>
                            <Typography variant="body2">
                              {getPersonDisplayName(user.person)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {user.person.identityType}: {user.person.identityNumber}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {user.company?.name || '-'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {user.position?.name || '-'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                              {user.roles.map((role, index) => (
                                <Chip
                                  key={index}
                                  label={role.name}
                                  size="small"
                                  variant="outlined"
                                />
                              ))}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={user.profile.isActive ? 'Activo' : 'Inactivo'}
                              color={user.profile.isActive ? 'success' : 'default'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {user.profile.createdAt.toLocaleDateString()}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <IconButton
                              size="small"
                              onClick={(e) => handleMenuOpen(e, user)}
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
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={filteredUsers.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  labelRowsPerPage="Filas por página:"
                  labelDisplayedRows={({ from, to, count }) =>
                    `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
                  }
                />
              </>
            )}
          </CardContent>
        </Card>

        {/* Action Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleEdit}>
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Editar Usuario</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleAssignCompanyAndPosition}>
            <ListItemIcon>
              <BusinessIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Asignar Empresa y Cargo</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleManageRoles}>
            <ListItemIcon>
              <SecurityIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Gestionar Roles</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
            <ListItemIcon>
              <DeleteIcon fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>Eliminar Usuario</ListItemText>
          </MenuItem>
        </Menu>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Confirmar Eliminación</DialogTitle>
          <DialogContent>
            <Typography>
              ¿Estás seguro de que deseas eliminar al usuario{' '}
              <strong>{selectedUser && getPersonDisplayName(selectedUser.person)}</strong>?
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
              Esta acción no se puede deshacer.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={confirmDelete} color="error" variant="contained">
              Eliminar
            </Button>
          </DialogActions>
        </Dialog>

        {/* New User Dialog */}
        <Dialog
          open={newUserDialogOpen}
          onClose={() => !isCreatingUser && setNewUserDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Crear Nuevo Usuario</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {/* Email */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email *"
                  type="email"
                  value={newUserForm.email}
                  onChange={(e) => handleNewUserFormChange('email', e.target.value)}
                  error={!!formErrors.email}
                  helperText={formErrors.email}
                  disabled={isCreatingUser}
                />
              </Grid>

              {/* Password */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Contraseña *"
                  type="password"
                  value={newUserForm.password}
                  onChange={(e) => handleNewUserFormChange('password', e.target.value)}
                  error={!!formErrors.password}
                  helperText={formErrors.password}
                  disabled={isCreatingUser}
                />
              </Grid>

              {/* First Name */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Primer Nombre *"
                  value={newUserForm.firstName}
                  onChange={(e) => handleNewUserFormChange('firstName', e.target.value)}
                  error={!!formErrors.firstName}
                  helperText={formErrors.firstName}
                  disabled={isCreatingUser}
                />
              </Grid>

              {/* Middle Name */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Segundo Nombre"
                  value={newUserForm.middleName}
                  onChange={(e) => handleNewUserFormChange('middleName', e.target.value)}
                  disabled={isCreatingUser}
                />
              </Grid>

              {/* Last Name */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Primer Apellido *"
                  value={newUserForm.lastName}
                  onChange={(e) => handleNewUserFormChange('lastName', e.target.value)}
                  error={!!formErrors.lastName}
                  helperText={formErrors.lastName}
                  disabled={isCreatingUser}
                />
              </Grid>

              {/* Second Last Name */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Segundo Apellido"
                  value={newUserForm.secondLastName}
                  onChange={(e) => handleNewUserFormChange('secondLastName', e.target.value)}
                  disabled={isCreatingUser}
                />
              </Grid>

              {/* Identity Type */}
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Tipo de Documento *</InputLabel>
                  <Select
                    value={newUserForm.identityType}
                    label="Tipo de Documento *"
                    onChange={(e) => handleNewUserFormChange('identityType', e.target.value)}
                    disabled={isCreatingUser}
                  >
                    <MenuItem value="CC">Cédula de Ciudadanía</MenuItem>
                    <MenuItem value="CE">Cédula de Extranjería</MenuItem>
                    <MenuItem value="TI">Tarjeta de Identidad</MenuItem>
                    <MenuItem value="PA">Pasaporte</MenuItem>
                    <MenuItem value="OTHER">Otro</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Identity Number */}
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  label="Número de Documento *"
                  value={newUserForm.identityNumber}
                  onChange={(e) => handleNewUserFormChange('identityNumber', e.target.value)}
                  error={!!formErrors.identityNumber}
                  helperText={formErrors.identityNumber}
                  disabled={isCreatingUser}
                />
              </Grid>

              {/* Phone */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Teléfono"
                  value={newUserForm.phone}
                  onChange={(e) => handleNewUserFormChange('phone', e.target.value)}
                  disabled={isCreatingUser}
                />
              </Grid>

              {/* Username */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nombre de Usuario"
                  value={newUserForm.username}
                  onChange={(e) => handleNewUserFormChange('username', e.target.value)}
                  error={!!formErrors.username}
                  helperText={formErrors.username || 'Opcional. Si se deja vacío, se usará el email'}
                  disabled={isCreatingUser}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => setNewUserDialogOpen(false)}
              disabled={isCreatingUser}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleCreateUser} 
              variant="contained"
              disabled={isCreatingUser}
              startIcon={isCreatingUser ? <CircularProgress size={20} /> : <PersonAddIcon />}
            >
              {isCreatingUser ? 'Creando...' : 'Crear Usuario'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit User Dialog */}
        <Dialog
          open={editUserDialogOpen}
          onClose={() => !isUpdatingUser && handleCancelEditUser()}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Editar Usuario</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {/* Email (Read-only) */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={editUserForm.email}
                  disabled={true}
                  helperText="El email no se puede modificar"
                />
              </Grid>

              {/* Username */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nombre de Usuario"
                  value={editUserForm.username}
                  onChange={(e) => handleEditUserFormChange('username', e.target.value)}
                  error={!!editFormErrors.username}
                  helperText={editFormErrors.username || 'Opcional. Si se deja vacío, se usará el email'}
                  disabled={isUpdatingUser}
                />
              </Grid>

              {/* First Name */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Primer Nombre *"
                  value={editUserForm.firstName}
                  onChange={(e) => handleEditUserFormChange('firstName', e.target.value)}
                  error={!!editFormErrors.firstName}
                  helperText={editFormErrors.firstName}
                  disabled={isUpdatingUser}
                />
              </Grid>

              {/* Middle Name */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Segundo Nombre"
                  value={editUserForm.middleName}
                  onChange={(e) => handleEditUserFormChange('middleName', e.target.value)}
                  disabled={isUpdatingUser}
                />
              </Grid>

              {/* Last Name */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Primer Apellido *"
                  value={editUserForm.lastName}
                  onChange={(e) => handleEditUserFormChange('lastName', e.target.value)}
                  error={!!editFormErrors.lastName}
                  helperText={editFormErrors.lastName}
                  disabled={isUpdatingUser}
                />
              </Grid>

              {/* Second Last Name */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Segundo Apellido"
                  value={editUserForm.secondLastName}
                  onChange={(e) => handleEditUserFormChange('secondLastName', e.target.value)}
                  disabled={isUpdatingUser}
                />
              </Grid>

              {/* Identity Type */}
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Tipo de Documento *</InputLabel>
                  <Select
                    value={editUserForm.identityType}
                    label="Tipo de Documento *"
                    onChange={(e) => handleEditUserFormChange('identityType', e.target.value)}
                    disabled={isUpdatingUser}
                  >
                    <MenuItem value="CC">Cédula de Ciudadanía</MenuItem>
                    <MenuItem value="CE">Cédula de Extranjería</MenuItem>
                    <MenuItem value="TI">Tarjeta de Identidad</MenuItem>
                    <MenuItem value="PA">Pasaporte</MenuItem>
                    <MenuItem value="OTHER">Otro</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Identity Number */}
              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  label="Número de Documento *"
                  value={editUserForm.identityNumber}
                  onChange={(e) => handleEditUserFormChange('identityNumber', e.target.value)}
                  error={!!editFormErrors.identityNumber}
                  helperText={editFormErrors.identityNumber}
                  disabled={isUpdatingUser}
                />
              </Grid>

              {/* Phone */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Teléfono"
                  value={editUserForm.phone}
                  onChange={(e) => handleEditUserFormChange('phone', e.target.value)}
                  disabled={isUpdatingUser}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={handleCancelEditUser}
              disabled={isUpdatingUser}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleUpdateUser} 
              variant="contained"
              disabled={isUpdatingUser}
              startIcon={isUpdatingUser ? <CircularProgress size={20} /> : <EditIcon />}
            >
              {isUpdatingUser ? 'Actualizando...' : 'Actualizar Usuario'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Assign Company and Position Dialog */}
        <Dialog
          open={assignCompanyPositionDialogOpen}
          onClose={() => !isAssigning && setAssignCompanyPositionDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Asignar Empresa y Cargo</DialogTitle>
          <DialogContent>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Usuario: <strong>{selectedUser && getPersonDisplayName(selectedUser.person)}</strong>
            </Typography>
            
            <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
              <InputLabel>Empresa *</InputLabel>
              <Select
                value={selectedCompanyId}
                label="Empresa *"
                onChange={(e) => setSelectedCompanyId(e.target.value)}
                disabled={isAssigning}
                required
              >
                <MenuItem value="">Seleccionar empresa</MenuItem>
                {companies.map((company) => (
                  <MenuItem key={company.companyId} value={company.companyId.toString()}>
                    {company.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Cargo *</InputLabel>
              <Select
                value={selectedPositionId}
                label="Cargo *"
                onChange={(e) => setSelectedPositionId(e.target.value)}
                disabled={isAssigning}
                required
              >
                <MenuItem value="">Seleccionar cargo</MenuItem>
                {positions.map((position) => (
                  <MenuItem key={position.positionId} value={position.positionId.toString()}>
                    {position.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Typography variant="caption" color="text.secondary">
              * Ambos campos son requeridos para crear una asignación completa
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAssignCompanyPositionDialogOpen(false)} disabled={isAssigning}>
              Cancelar
            </Button>
            <Button 
              onClick={confirmAssignCompanyAndPosition} 
              variant="contained" 
              disabled={isAssigning || !selectedCompanyId || !selectedPositionId}
              startIcon={isAssigning ? <CircularProgress size={20} /> : <BusinessIcon />}
            >
              {isAssigning ? 'Asignando...' : 'Asignar'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Manage Roles Dialog */}
        <Dialog
          open={manageRolesDialogOpen}
          onClose={() => !isAssigning && setManageRolesDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Gestionar Roles</DialogTitle>
          <DialogContent>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Usuario: <strong>{selectedUser && getPersonDisplayName(selectedUser.person)}</strong>
            </Typography>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Roles</InputLabel>
              <Select
                multiple
                value={selectedRoleIds}
                label="Roles"
                onChange={(e) => setSelectedRoleIds(typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value)}
                disabled={isAssigning}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => {
                      const role = roles.find(r => r.roleId.toString() === value);
                      return (
                        <Chip key={value} label={role?.name || value} size="small" />
                      );
                    })}
                  </Box>
                )}
              >
                {roles.map((role) => (
                  <MenuItem key={role.roleId} value={role.roleId.toString()}>
                    {role.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setManageRolesDialogOpen(false)} disabled={isAssigning}>
              Cancelar
            </Button>
            <Button onClick={confirmManageRoles} variant="contained" disabled={isAssigning}>
              {isAssigning ? 'Actualizando...' : 'Actualizar'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default UserManagement;