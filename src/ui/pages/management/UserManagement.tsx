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
  Avatar,
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
  Alert,
  CircularProgress,
  useTheme,
  alpha
} from '@mui/material';
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
import { getPersonDisplayName, Person } from '../../../domain/user/Person';
import { User } from '../../../domain/user/User';
import { Company } from '../../../domain/company/Company';
import { Position } from '../../../domain/position/Position';
import { Role } from '../../../domain/role/Role';
import { GetUsers } from '../../../application/user/GetUsers';
import { DeleteUser } from '../../../application/user/DeleteUser';
import { AssignUserCompany } from '../../../application/user/AssignUserCompany';
import { AssignUserPosition } from '../../../application/user/AssignUserPosition';
import { ManageUserRoles } from '../../../application/user/ManageUserRoles';
import { GetCompanies } from '../../../application/company/GetCompanies';
import { GetPositions } from '../../../application/position/GetPositions';
import { GetRoles } from '../../../application/role/GetRoles';
import { SupabaseUserRepository } from '../../../infrastructure/supabase/SupabaseUserRepository';
import { SupabaseCompanyRepository } from '../../../infrastructure/supabase/SupabaseCompanyRepository';
import { SupabasePositionRepository } from '../../../infrastructure/supabase/SupabasePositionRepository';
import { SupabaseRoleRepository } from '../../../infrastructure/supabase/SupabaseRoleRepository';
import { DatabaseStatus } from '../../components/common/DatabaseStatus';

// Initialize repositories and use cases
const userRepository = new SupabaseUserRepository();
const companyRepository = new SupabaseCompanyRepository();
const positionRepository = new SupabasePositionRepository();
const roleRepository = new SupabaseRoleRepository();

const getUsers = new GetUsers(userRepository);
const deleteUser = new DeleteUser(userRepository);
const assignUserCompany = new AssignUserCompany(userRepository, companyRepository);
const assignUserPosition = new AssignUserPosition(userRepository, positionRepository);
const manageUserRoles = new ManageUserRoles(userRepository, roleRepository);
const getCompanies = new GetCompanies(companyRepository);
const getPositions = new GetPositions(positionRepository);
const getRoles = new GetRoles(roleRepository);

const UserManagement: React.FC = () => {
  const theme = useTheme();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [error, setError] = useState('');
  const [isDatabaseReady, setIsDatabaseReady] = useState(false);

  // Load users and related data
  useEffect(() => {
    const loadData = async () => {
      if (!isDatabaseReady) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError('');
        
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
        
      } catch (error) {
        console.error('Error loading data:', error);
        setError(error instanceof Error ? error.message : 'Error al cargar datos');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [page, rowsPerPage, searchTerm, isDatabaseReady]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0); // Reset to first page when searching
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
    setSelectedUser(null);
  };

  const handleEdit = () => {
    console.log('Edit user:', selectedUser);
    handleMenuClose();
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const confirmDelete = async () => {
    if (!selectedUser) return;
    
    try {
      await deleteUser.execute({ userId: selectedUser.id });
      
      // Refresh users list
      const usersResponse = await getUsers.execute({
        page,
        limit: rowsPerPage,
        searchTerm: searchTerm || undefined
      });
      
      setUsers(usersResponse.users);
      setTotalUsers(usersResponse.total);
      setDeleteDialogOpen(false);
      setSelectedUser(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al eliminar usuario');
    }
  };

  const handleAssignCompany = async () => {
    if (!selectedUser) return;
    
    console.log('Assign company to user:', selectedUser);
    handleMenuClose();
  };

  const handleAssignPosition = async () => {
    if (!selectedUser) return;
    
    console.log('Assign position to user:', selectedUser);
    handleMenuClose();
  };

  const handleManageRoles = async () => {
    if (!selectedUser) return;
    
    console.log('Manage roles for user:', selectedUser);
    handleMenuClose();
  };

  // Users are already filtered and paginated by the backend
  const paginatedUsers = users;

  return (
    <Container maxWidth={false}>
      <Box sx={{ py: 4 }}>
        {/* Database Status Check */}
        <DatabaseStatus onStatusChange={setIsDatabaseReady} />
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

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
                  sx={{ whiteSpace: 'nowrap' }}
                >
                  Filtros
                </Button>
              </Box>
              
              <Button
                variant="contained"
                startIcon={<AddIcon />}
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
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Avatar sx={{ 
                                bgcolor: theme.palette.primary.main,
                                width: 40,
                                height: 40
                              }}>
                                {user.person.firstName.charAt(0)}
                              </Avatar>
                              <Box>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                  {getPersonDisplayName(user.person)}
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                  {user.email}
                                </Typography>
                                {user.profile.username && (
                                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                                    @{user.profile.username}
                                  </Typography>
                                )}
                              </Box>
                            </Box>
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
                  count={totalUsers}
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
          <MenuItem onClick={handleAssignCompany}>
            <ListItemIcon>
              <BusinessIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Asignar Empresa</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleAssignPosition}>
            <ListItemIcon>
              <WorkIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Asignar Cargo</ListItemText>
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
      </Box>
    </Container>
  );
};

export default UserManagement;