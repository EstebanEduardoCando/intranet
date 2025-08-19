import { UserNotification, CreateUserNotificationData, UserNotificationFilter } from './UserNotification';

export interface UserNotificationRepository {
  // Crear notificación
  create(data: CreateUserNotificationData): Promise<number>;
  
  // Obtener notificaciones por usuario
  getByUserId(filter: UserNotificationFilter, limit?: number, offset?: number): Promise<UserNotification[]>;
  
  // Obtener notificación por ID
  getById(notificationId: number, userId: string): Promise<UserNotification | null>;
  
  // Marcar como leída
  markAsRead(notificationId: number, userId: string): Promise<void>;
  
  // Marcar como descartada
  markAsDismissed(notificationId: number, userId: string): Promise<void>;
  
  // Marcar todas como leídas
  markAllAsRead(userId: string): Promise<number>;
  
  // Contar notificaciones no leídas
  countUnread(userId: string): Promise<number>;
  
  // Eliminar notificaciones expiradas
  deleteExpired(): Promise<number>;
  
  // Limpiar notificaciones antiguas
  cleanOldNotifications(userId: string, keepLastCount: number): Promise<number>;
}