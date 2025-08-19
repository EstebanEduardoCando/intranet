export interface UserNotification {
  notificationId: number;
  userId: string;
  
  // Contenido de la notificación
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  
  // Metadatos
  category: string;
  priority: number; // 1=max, 5=min
  
  // Estado
  isRead: boolean;
  isDismissed: boolean;
  readAt?: Date;
  dismissedAt?: Date;
  
  // Datos adicionales
  data?: Record<string, any>;
  expiresAt?: Date;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserNotificationData {
  userId: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  category?: string;
  priority?: number;
  data?: Record<string, any>;
  expiresAt?: Date;
}

export interface UserNotificationFilter {
  userId: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  category?: string;
  isRead?: boolean;
  isDismissed?: boolean;
  priority?: number;
  dateFrom?: Date;
  dateTo?: Date;
  includeExpired?: boolean;
}