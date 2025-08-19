import React, { useState, useEffect } from 'react';
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Typography,
  Collapse,
  IconButton
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Storage as StorageIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import { supabase } from '../../../infrastructure/supabase/supabaseClient';

interface DatabaseStatusProps {
  onStatusChange?: (isReady: boolean) => void;
}

export const DatabaseStatus: React.FC<DatabaseStatusProps> = ({ onStatusChange }) => {
  const [isReady, setIsReady] = useState<boolean | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [error, setError] = useState<string>('');

  const checkDatabaseStatus = async () => {
    try {
      // Test if the main tables exist
      const tables = ['user_profiles', 'companies', 'positions', 'roles'];
      let allTablesExist = true;
      
      for (const table of tables) {
        const { error } = await supabase
          .from(table)
          .select('*')
          .limit(1);
        
        if (error) {
          allTablesExist = false;
          setError(`Table '${table}' not found: ${error.message}`);
          break;
        }
      }
      
      setIsReady(allTablesExist);
      onStatusChange?.(allTablesExist);
      
      if (allTablesExist) {
        setError('');
      }
    } catch (err) {
      setIsReady(false);
      setError(err instanceof Error ? err.message : 'Unknown error');
      onStatusChange?.(false);
    }
  };

  useEffect(() => {
    checkDatabaseStatus();
  }, []);

  if (isReady === true) {
    return (
      <Alert severity="success" icon={<CheckCircleIcon />} sx={{ mb: 2 }}>
        <AlertTitle>Base de Datos Lista</AlertTitle>
        Las tablas de User Management están configuradas correctamente.
      </Alert>
    );
  }

  if (isReady === false) {
    return (
      <Alert severity="error" icon={<ErrorIcon />} sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <Box sx={{ flex: 1 }}>
            <AlertTitle>Base de Datos No Configurada</AlertTitle>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Las tablas necesarias para User Management no existen en Supabase.
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Button
                size="small"
                variant="outlined"
                color="error"
                onClick={() => setIsExpanded(!isExpanded)}
                endIcon={
                  <ExpandMoreIcon 
                    sx={{ 
                      transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s'
                    }} 
                  />
                }
              >
                Ver Instrucciones
              </Button>
              
              <Button
                size="small"
                variant="contained"
                color="error"
                onClick={checkDatabaseStatus}
                startIcon={<StorageIcon />}
              >
                Verificar Nuevamente
              </Button>
            </Box>
          </Box>
        </Box>
        
        <Collapse in={isExpanded}>
          <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              🚀 Pasos para Configurar:
            </Typography>
            
            <Typography variant="body2" component="div" sx={{ mb: 1 }}>
              <strong>1.</strong> Ve a tu <strong>Panel de Supabase</strong> → <strong>SQL Editor</strong>
            </Typography>
            
            <Typography variant="body2" component="div" sx={{ mb: 1 }}>
              <strong>2.</strong> Copia el contenido del archivo:
              <code style={{ 
                backgroundColor: 'rgba(0,0,0,0.2)', 
                padding: '2px 6px', 
                borderRadius: '4px',
                marginLeft: '8px'
              }}>
                src/infrastructure/supabase/migrations/002_create_complete_schema.sql
              </code>
            </Typography>
            
            <Typography variant="body2" component="div" sx={{ mb: 1 }}>
              <strong>3.</strong> Pégalo en el SQL Editor y ejecuta
            </Typography>
            
            <Typography variant="body2" component="div" sx={{ mb: 2 }}>
              <strong>4.</strong> Haz clic en "Verificar Nuevamente" cuando termines
            </Typography>
            
            {error && (
              <Typography variant="caption" sx={{ 
                color: 'rgba(255,255,255,0.8)',
                fontFamily: 'monospace',
                display: 'block',
                mt: 1,
                p: 1,
                bgcolor: 'rgba(0,0,0,0.2)',
                borderRadius: 1
              }}>
                Error: {error}
              </Typography>
            )}
          </Box>
        </Collapse>
      </Alert>
    );
  }

  // Loading state
  return (
    <Alert severity="info" icon={<StorageIcon />} sx={{ mb: 2 }}>
      <AlertTitle>Verificando Base de Datos...</AlertTitle>
      Comprobando si las tablas necesarias están configuradas.
    </Alert>
  );
};