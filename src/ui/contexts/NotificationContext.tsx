import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuthStore } from '../store/useAuth';
import { SupabaseUserNotificationRepository } from '../../infrastructure/supabase/SupabaseUserNotificationRepository';
import { CreateUserNotification } from '../../application/notification/CreateUserNotification';
import { GetUserNotifications } from '../../application/notification/GetUserNotifications';
import { MarkNotificationAsRead } from '../../application/notification/MarkNotificationAsRead';
import { MarkAllNotificationsAsRead } from '../../application/notification/MarkAllNotificationsAsRead';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title?: string;
  message: string;
  duration?: number; // Duration in milliseconds (0 = no auto-dismiss)
  isRead?: boolean;
  timestamp?: Date;
  action?: {
    label: string;
    onClick: () => void;
  };
  // Para notificaciones persistentes
  isPersistent?: boolean;
  category?: string;
  priority?: number;
  data?: Record<string, any>;
}

interface NotificationContextType {
  notifications: Notification[];
  notificationHistory: Notification[];
  unreadCount: number;
  isLoading: boolean;
  showNotification: (notification: Omit<Notification, 'id'>) => string;
  hideNotification: (id: string) => void;
  clearAllNotifications: () => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  loadPersistentNotifications: () => Promise<void>;
  
  // Convenience methods
  showSuccess: (message: string, title?: string, duration?: number, persistent?: boolean) => string;
  showError: (message: string, title?: string, duration?: number, persistent?: boolean) => string;
  showWarning: (message: string, title?: string, duration?: number, persistent?: boolean) => string;
  showInfo: (message: string, title?: string, duration?: number, persistent?: boolean) => string;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

// Dependency injection
const notificationRepository = new SupabaseUserNotificationRepository();
const createUserNotification = new CreateUserNotification(notificationRepository);
const getUserNotifications = new GetUserNotifications(notificationRepository);
const markNotificationAsRead = new MarkNotificationAsRead(notificationRepository);
const markAllNotificationsAsRead = new MarkAllNotificationsAsRead(notificationRepository);

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationHistory, setNotificationHistory] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user, isAuthenticated } = useAuthStore();

  const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  const showNotification = (notification: Omit<Notification, 'id'>): string => {
    const id = generateId();
    const newNotification: Notification = {
      id,
      duration: 3000, // Default 3 seconds
      isRead: false,
      timestamp: new Date(),
      ...notification,
    };

    setNotifications(prev => [...prev, newNotification]);
    
    // Add to history (keep only last 50)
    setNotificationHistory(prev => [newNotification, ...prev].slice(0, 50));

    // Si es persistente y hay usuario autenticado, guardar en BD
    if (notification.isPersistent && user?.id) {
      createUserNotification.execute({
        userId: user.id,
        title: notification.title || 'Notificación',
        message: notification.message,
        type: notification.type,
        category: notification.category || 'general',
        priority: notification.priority || 3,
        data: notification.data
      }).then(notificationId => {
        console.log('Persistent notification created with ID:', notificationId);
      }).catch(error => {
        console.error('Error creating persistent notification:', error);
      });
    }

    // Auto-dismiss if duration is set
    if (newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        hideNotification(id);
      }, newNotification.duration);
    }

    return id;
  };

  const hideNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const markAsRead = async (id: string) => {
    // Marcar en memoria
    setNotificationHistory(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true }
          : notification
      )
    );

    // Si es una notificación persistente numérica, marcar en BD
    const numericId = parseInt(id);
    if (!isNaN(numericId) && user?.id) {
      try {
        await markNotificationAsRead.execute(numericId, user.id);
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    }
  };

  const markAllAsRead = async () => {
    // Marcar en memoria
    setNotificationHistory(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );

    // Marcar en BD si hay usuario
    if (user?.id) {
      try {
        await markAllNotificationsAsRead.execute(user.id);
      } catch (error) {
        console.error('Error marking all notifications as read:', error);
      }
    }
  };

  const unreadCount = notificationHistory.filter(n => !n.isRead).length;

  // Cargar notificaciones persistentes
  const loadPersistentNotifications = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const result = await getUserNotifications.execute(
        { userId: user.id, isRead: false },
        20
      );
      
      // Convertir notificaciones persistentes al formato local
      const persistentNotifications: Notification[] = result.notifications.map(n => ({
        id: n.notificationId.toString(),
        type: n.type,
        title: n.title,
        message: n.message,
        isRead: n.isRead,
        timestamp: n.createdAt,
        duration: 0, // No auto-dismiss para persistentes
        isPersistent: true,
        category: n.category,
        priority: n.priority,
        data: n.data
      }));
      
      setNotificationHistory(prev => {
        // Agregar persistentes al historial sin duplicar
        const existingIds = new Set(prev.map(n => n.id));
        const newPersistent = persistentNotifications.filter(n => !existingIds.has(n.id));
        return [...newPersistent, ...prev];
      });
    } catch (error) {
      console.error('Error loading persistent notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar notificaciones al autenticarse
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      loadPersistentNotifications();
    }
  }, [isAuthenticated, user?.id]);

  // Convenience methods
  const showSuccess = (message: string, title?: string, duration?: number, persistent = false): string => {
    return showNotification({
      type: 'success',
      message,
      title: title || 'Éxito',
      duration: duration !== undefined ? duration : 3000,
      isPersistent: persistent
    });
  };

  const showError = (message: string, title?: string, duration?: number, persistent = false): string => {
    return showNotification({
      type: 'error',
      message,
      title: title || 'Error',
      duration: duration !== undefined ? duration : 3000,
      isPersistent: persistent
    });
  };

  const showWarning = (message: string, title?: string, duration?: number, persistent = false): string => {
    return showNotification({
      type: 'warning',
      message,
      title: title || 'Advertencia',
      duration: duration !== undefined ? duration : 3000,
      isPersistent: persistent
    });
  };

  const showInfo = (message: string, title?: string, duration?: number, persistent = false): string => {
    return showNotification({
      type: 'info',
      message,
      title: title || 'Información',
      duration: duration !== undefined ? duration : 3000,
      isPersistent: persistent
    });
  };

  const value: NotificationContextType = {
    notifications,
    notificationHistory,
    unreadCount,
    isLoading,
    showNotification,
    hideNotification,
    clearAllNotifications,
    markAsRead,
    markAllAsRead,
    loadPersistentNotifications,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};