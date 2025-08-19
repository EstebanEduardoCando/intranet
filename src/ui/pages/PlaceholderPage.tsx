import React from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Chip,
  useTheme
} from '@mui/material';
import {
  Construction as ConstructionIcon
} from '@mui/icons-material';

interface PlaceholderPageProps {
  moduleName: string;
  moduleDescription?: string;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ 
  moduleName, 
  moduleDescription 
}) => {
  const theme = useTheme();

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 6, textAlign: 'center' }}>
        <Card sx={{ maxWidth: 500, mx: 'auto' }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ mb: 3 }}>
              <ConstructionIcon 
                sx={{ 
                  fontSize: 64, 
                  color: theme.palette.primary.main,
                  mb: 2 
                }} 
              />
            </Box>
            
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
              {moduleName}
            </Typography>
            
            <Chip 
              label="En Desarrollo" 
              color="warning" 
              sx={{ mb: 3 }}
            />
            
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Esta funcionalidad está siendo desarrollada y estará disponible próximamente.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default PlaceholderPage;