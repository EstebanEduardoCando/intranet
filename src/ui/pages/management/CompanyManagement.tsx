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
  Tooltip,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Divider,
  Paper
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Search as SearchIcon,
  History as HistoryIcon,
  Business as BusinessIcon,
  FilterList as FilterIcon,
  Restore as RestoreIcon
} from '@mui/icons-material';
import { Company } from '../../../domain/company/Company';
import { GetCompanies } from '../../../application/company/GetCompanies';
import { SupabaseCompanyRepository } from '../../../infrastructure/supabase/SupabaseCompanyRepository';
import { useNotifications } from '../../contexts/NotificationContext';
import { useAuthStore } from '../../store/useAuth';

// Dependency injection
const companyRepository = new SupabaseCompanyRepository();
const getCompanies = new GetCompanies(companyRepository);

interface CompanyFilter {
  searchText: string;
  status: 'all' | 'active' | 'inactive';
  sortBy: 'name' | 'created_at' | 'updated_at';
  sortOrder: 'asc' | 'desc';
}

const CompanyManagement: React.FC = () => {
  const { user } = useAuthStore();
  const { showSuccess, showError, showWarning } = useNotifications();
  
  // Estados
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Paginación
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  
  // Filtros
  const [filter, setFilter] = useState<CompanyFilter>({
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
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    description: ''
  });
  
  // Menú de acciones
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [actionCompany, setActionCompany] = useState<Company | null>(null);

  // Cargar empresas
  const loadCompanies = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getCompanies.execute();
      
      // Aplicar filtros localmente por ahora
      let filteredCompanies = result;
      
      if (filter.searchText) {
        const searchLower = filter.searchText.toLowerCase();
        filteredCompanies = filteredCompanies.filter(company =>
          company.name.toLowerCase().includes(searchLower) ||
          company.description?.toLowerCase().includes(searchLower) ||
          company.email?.toLowerCase().includes(searchLower)
        );
      }
      
      if (filter.status !== 'all') {
        const isActive = filter.status === 'active';
        filteredCompanies = filteredCompanies.filter(company => !company.isDeleted === isActive);
      }
      
      // Ordenar
      filteredCompanies.sort((a, b) => {
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
      
      setTotalCount(filteredCompanies.length);
      
      // Aplicar paginación
      const startIndex = page * rowsPerPage;
      const paginatedCompanies = filteredCompanies.slice(startIndex, startIndex + rowsPerPage);
      
      setCompanies(paginatedCompanies);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error loading companies';
      setError(errorMessage);
      showError('Error al cargar empresas', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Efectos
  useEffect(() => {
    loadCompanies();
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
  const handleFilterChange = (newFilter: Partial<CompanyFilter>) => {
    setFilter(prev => ({ ...prev, ...newFilter }));
    setPage(0);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchText = event.target.value;
    // Debounce de búsqueda
    setTimeout(() => {
      handleFilterChange({ searchText });
    }, 300);
  };

  // Handlers de diálogos
  const handleCreateClick = () => {
    setFormData({
      name: '',
      address: '',
      phone: '',
      email: '',
      website: '',
      description: ''
    });
    setCreateDialogOpen(true);
  };

  const handleEditClick = (company: Company) => {
    setSelectedCompany(company);
    setFormData({
      name: company.name,
      address: company.address || '',
      phone: company.phone || '',
      email: company.email || '',
      website: company.website || '',
      description: company.description || ''
    });
    setEditDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteClick = (company: Company) => {
    setSelectedCompany(company);
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleHistoryClick = (company: Company) => {
    setSelectedCompany(company);
    setHistoryDialogOpen(true);
    handleMenuClose();
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, company: Company) => {
    setAnchorEl(event.currentTarget);
    setActionCompany(company);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setActionCompany(null);
  };

  // Handlers de formulario
  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCreateSubmit = async () => {
    try {
      // TODO: Implementar creación de empresa con auditoría
      showSuccess('Empresa creada exitosamente');
      setCreateDialogOpen(false);
      loadCompanies();
    } catch (error) {
      showError('Error al crear empresa');
    }
  };

  const handleEditSubmit = async () => {
    try {
      // TODO: Implementar edición de empresa con auditoría
      showSuccess('Empresa actualizada exitosamente');
      setEditDialogOpen(false);
      loadCompanies();
    } catch (error) {
      showError('Error al actualizar empresa');
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      // TODO: Implementar eliminación lógica con auditoría
      showSuccess('Empresa eliminada exitosamente');
      setDeleteDialogOpen(false);
      loadCompanies();
    } catch (error) {
      showError('Error al eliminar empresa');
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
          <BusinessIcon color="primary" />
          Administración de Empresas
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Gestiona las empresas del sistema con registro completo de auditoría
        </Typography>
      </Box>

      {/* Controles */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Búsqueda */}
            <TextField
              placeholder="Buscar empresas..."
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
              Nueva Empresa
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
                <TableCell>Empresa</TableCell>
                <TableCell>Contacto</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Última modificación</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {companies.map((company) => (
                <TableRow key={company.companyId} hover>
                  <TableCell>
                    <Box>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {company.name}
                      </Typography>
                      {company.description && (
                        <Typography variant="caption" color="text.secondary">
                          {company.description}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      {company.email && (
                        <Typography variant="body2">{company.email}</Typography>
                      )}
                      {company.phone && (
                        <Typography variant="caption" color="text.secondary">
                          {company.phone}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={company.isDeleted ? 'Inactivo' : 'Activo'}
                      color={company.isDeleted ? 'error' : 'success'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatDate(company.updatedAt)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuClick(e, company)}
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
        <MenuItem onClick={() => actionCompany && handleEditClick(actionCompany)}>
          <EditIcon sx={{ mr: 1 }} fontSize="small" />
          Editar
        </MenuItem>
        <MenuItem onClick={() => actionCompany && handleHistoryClick(actionCompany)}>
          <HistoryIcon sx={{ mr: 1 }} fontSize="small" />
          Ver historial
        </MenuItem>
        <Divider />
        <MenuItem 
          onClick={() => actionCompany && handleDeleteClick(actionCompany)}
          sx={{ color: 'error.main' }}
        >
          <DeleteIcon sx={{ mr: 1 }} fontSize="small" />
          {actionCompany?.isDeleted ? 'Restaurar' : 'Eliminar'}
        </MenuItem>
      </Menu>

      {/* Diálogo de creación */}
      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Nueva Empresa</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Nombre de la empresa"
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
            <TextField
              label="Dirección"
              value={formData.address}
              onChange={(e) => handleFormChange('address', e.target.value)}
              fullWidth
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => handleFormChange('email', e.target.value)}
                fullWidth
              />
              <TextField
                label="Teléfono"
                value={formData.phone}
                onChange={(e) => handleFormChange('phone', e.target.value)}
                fullWidth
              />
            </Box>
            <TextField
              label="Sitio web"
              value={formData.website}
              onChange={(e) => handleFormChange('website', e.target.value)}
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
            Crear Empresa
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
        <DialogTitle>Editar Empresa</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Nombre de la empresa"
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
            <TextField
              label="Dirección"
              value={formData.address}
              onChange={(e) => handleFormChange('address', e.target.value)}
              fullWidth
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => handleFormChange('email', e.target.value)}
                fullWidth
              />
              <TextField
                label="Teléfono"
                value={formData.phone}
                onChange={(e) => handleFormChange('phone', e.target.value)}
                fullWidth
              />
            </Box>
            <TextField
              label="Sitio web"
              value={formData.website}
              onChange={(e) => handleFormChange('website', e.target.value)}
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
          {selectedCompany?.isDeleted ? 'Restaurar Empresa' : 'Eliminar Empresa'}
        </DialogTitle>
        <DialogContent>
          <Typography>
            {selectedCompany?.isDeleted 
              ? `¿Estás seguro que deseas restaurar la empresa "${selectedCompany?.name}"?`
              : `¿Estás seguro que deseas eliminar la empresa "${selectedCompany?.name}"? Esta acción se puede revertir posteriormente.`
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
            color={selectedCompany?.isDeleted ? 'primary' : 'error'}
          >
            {selectedCompany?.isDeleted ? 'Restaurar' : 'Eliminar'}
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
          Historial de Cambios - {selectedCompany?.name}
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

export default CompanyManagement;