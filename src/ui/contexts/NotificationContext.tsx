import React, { createContext, useContext, useState, ReactNode } from 'react';

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
}

interface NotificationContextType {
  notifications: Notification[];
  notificationHistory: Notification[];
  unreadCount: number;
  showNotification: (notification: Omit<Notification, 'id'>) => string;
  hideNotification: (id: string) => void;
  clearAllNotifications: () => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  
  // Convenience methods
  showSuccess: (message: string, title?: string, duration?: number) => string;
  showError: (message: string, title?: string, duration?: number) => string;
  showWarning: (message: string, title?: string, duration?: number) => string;
  showInfo: (message: string, title?: string, duration?: number) => string;
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

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationHistory, setNotificationHistory] = useState<Notification[]>([]);

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

  const markAsRead = (id: string) => {
    setNotificationHistory(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotificationHistory(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const unreadCount = notificationHistory.filter(n => !n.isRead).length;

  // Convenience methods
  const showSuccess = (message: string, title?: string, duration?: number): string => {
    return showNotification({
      type: 'success',
      message,
      title: title || 'Éxito',
      duration: duration !== undefined ? duration : 3000, // Success messages auto-dismiss after 3 seconds
    });
  };

  const showError = (message: string, title?: string, duration?: number): string => {
    return showNotification({
      type: 'error',
      message,
      title: title || 'Error',
      duration: duration !== undefined ? duration : 3000, // Errors auto-dismiss after 3 seconds
    });
  };

  const showWarning = (message: string, title?: string, duration?: number): string => {
    return showNotification({
      type: 'warning',
      message,
      title: title || 'Advertencia',
      duration: duration !== undefined ? duration : 3000, // Warnings auto-dismiss after 3 seconds
    });
  };

  const showInfo = (message: string, title?: string, duration?: number): string => {
    return showNotification({
      type: 'info',
      message,
      title: title || 'Información',
      duration: duration !== undefined ? duration : 3000, // Info messages auto-dismiss after 3 seconds
    });
  };

  const value: NotificationContextType = {
    notifications,
    notificationHistory,
    unreadCount,
    showNotification,
    hideNotification,
    clearAllNotifications,
    markAsRead,
    markAllAsRead,
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