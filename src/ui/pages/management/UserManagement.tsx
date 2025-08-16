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

// Mock data structure for demonstration
interface UserData {
  id: string;
  person: Person;
  profile: {
    username?: string;
  };
  email: string;
  isActive: boolean;
  company?: {
    name: string;
  };
  position?: {
    name: string;
  };
  roles: {
    name: string;
  }[];
  createdAt: Date;
}

const UserManagement: React.FC = () => {
  const theme = useTheme();
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [error, setError] = useState('');

  // Mock data for demonstration
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setIsLoading(true);
        // TODO: Implement real user fetching from repository - UserManagement.tsx:67 - Prioridad: Alta
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockUsers: UserData[] = [
          {
            id: '1',
            person: {
              personId: 1,
              firstName: 'Juan',
              lastName: 'Pérez',
              identityType: 'DNI',
              identityNumber: '12345678',
              phone: '+51987654321',
              createdAt: new Date('2024-01-15'),
              updatedAt: new Date('2024-01-15')
            },
            profile: {
              username: 'jperez'
            },
            email: 'juan.perez@empresa.com',
            isActive: true,
            company: { name: 'Matriz' },
            position: { name: 'Desarrollador Senior' },
            roles: [{ name: 'Administrador' }, { name: 'Usuario' }],
            createdAt: new Date('2024-01-15')
          },
          {
            id: '2',
            person: {
              personId: 2,
              firstName: 'María',
              lastName: 'García',
              identityType: 'DNI',
              identityNumber: '87654321',
              createdAt: new Date('2024-02-20'),
              updatedAt: new Date('2024-02-20')
            },
            profile: {
              username: 'mgarcia'
            },
            email: 'maria.garcia@empresa.com',
            isActive: true,
            company: { name: 'Sucursal Norte' },
            position: { name: 'Analista de Sistemas' },
            roles: [{ name: 'Usuario' }],
            createdAt: new Date('2024-02-20')
          }
        ];
        
        setUsers(mockUsers);
      } catch (error) {
        console.error('Error loading users:', error);
        setError('Error al cargar usuarios');
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, []);

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

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, user: UserData) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  const handleEdit = () => {
    // TODO: Implement user edit functionality - UserManagement.tsx:134 - Prioridad: Media
    console.log('Edit user:', selectedUser);
    handleMenuClose();
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const confirmDelete = async () => {
    try {
      // TODO: Implement user deletion - UserManagement.tsx:145 - Prioridad: Media
      console.log('Delete user:', selectedUser);
      setDeleteDialogOpen(false);
      setSelectedUser(null);
    } catch (error) {
      setError('Error al eliminar usuario');
    }
  };

  const handleAssignCompany = () => {
    // TODO: Implement company assignment - UserManagement.tsx:154 - Prioridad: Media
    console.log('Assign company to user:', selectedUser);
    handleMenuClose();
  };

  const handleAssignPosition = () => {
    // TODO: Implement position assignment - UserManagement.tsx:160 - Prioridad: Media
    console.log('Assign position to user:', selectedUser);
    handleMenuClose();
  };

  const handleManageRoles = () => {
    // TODO: Implement role management - UserManagement.tsx:166 - Prioridad: Media
    console.log('Manage roles for user:', selectedUser);
    handleMenuClose();
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user =>
    user.person.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.person.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.person.identityNumber.includes(searchTerm)
  );

  // Paginate filtered users
  const paginatedUsers = filteredUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Container maxWidth={false}>
      <Box sx={{ py: 4 }}>
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
                              label={user.isActive ? 'Activo' : 'Inactivo'}
                              color={user.isActive ? 'success' : 'default'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {user.createdAt.toLocaleDateString()}
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