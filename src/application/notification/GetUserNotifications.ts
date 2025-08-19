import { UserNotificationRepository } from '../../domain/notification/UserNotificationRepository';
import { UserNotification, UserNotificationFilter } from '../../domain/notification/UserNotification';

export class GetUserNotifications {
  constructor(private notificationRepository: UserNotificationRepository) {}

  async execute(
    filter: UserNotificationFilter, 
    limit = 50, 
    offset = 0
  ): Promise<{
    notifications: UserNotification[];
    unreadCount: number;
  }> {
    // Validaciones
    if (!filter.userId.trim()) {
      throw new Error('User ID is required');
    }

    if (limit < 1 || limit > 100) {
      throw new Error('Limit must be between 1 and 100');
    }

    if (offset < 0) {
      throw new Error('Offset must be non-negative');
    }

    // Obtener notificaciones
    const notifications = await this.notificationRepository.getByUserId(filter, limit, offset);
    
    // Obtener conteo de no leídas
    const unreadCount = await this.notificationRepository.countUnread(filter.userId);

    return {
      notifications,
      unreadCount
    };
  }
}