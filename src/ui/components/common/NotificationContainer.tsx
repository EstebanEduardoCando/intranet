import React from 'react';
import {
  Snackbar,
  Alert,
  AlertTitle,
  Box,
  IconButton,
  Portal,
  Slide,
  Stack,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useNotifications, Notification, NotificationType } from '../../contexts/NotificationContext';

const getAlertSeverity = (type: NotificationType) => {
  switch (type) {
    case 'success':
      return 'success';
    case 'error':
      return 'error';
    case 'warning':
      return 'warning';
    case 'info':
      return 'info';
    default:
      return 'info';
  }
};

interface NotificationItemProps {
  notification: Notification;
  onClose: () => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onClose }) => {
  return (
    <Alert
      severity={getAlertSeverity(notification.type)}
      onClose={onClose}
      action={
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {notification.action && (
            <IconButton
              size="small"
              color="inherit"
              onClick={notification.action.onClick}
              sx={{ mr: 1 }}
            >
              {notification.action.label}
            </IconButton>
          )}
          <IconButton
            size="small"
            color="inherit"
            onClick={onClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      }
      sx={{
        width: '100%',
        maxWidth: 500,
        mb: 1,
        boxShadow: 2,
        '& .MuiAlert-message': {
          width: '100%',
        }
      }}
    >
      {notification.title && (
        <AlertTitle sx={{ fontWeight: 600 }}>
          {notification.title}
        </AlertTitle>
      )}
      {notification.message}
    </Alert>
  );
};

const NotificationContainer: React.FC = () => {
  const { notifications, hideNotification } = useNotifications();

  if (notifications.length === 0) {
    return null;
  }

  return (
    <Portal>
      <Box
        sx={{
          position: 'fixed',
          top: 80, // Below header
          right: 24,
          zIndex: (theme) => theme.zIndex.snackbar,
          maxHeight: 'calc(100vh - 100px)',
          overflow: 'auto',
        }}
      >
        <Stack spacing={1}>
          {notifications.map((notification) => (
            <Slide
              key={notification.id}
              direction="left"
              in={true}
              timeout={300}
            >
              <div>
                <NotificationItem
                  notification={notification}
                  onClose={() => hideNotification(notification.id)}
                />
              </div>
            </Slide>
          ))}
        </Stack>
      </Box>
    </Portal>
  );
};

export default NotificationContainer;