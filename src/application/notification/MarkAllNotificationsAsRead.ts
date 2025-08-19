import { UserNotificationRepository } from '../../domain/notification/UserNotificationRepository';

export class MarkAllNotificationsAsRead {
  constructor(private notificationRepository: UserNotificationRepository) {}

  async execute(userId: string): Promise<number> {
    // Validaciones
    if (!userId.trim()) {
      throw new Error('User ID is required');
    }

    // Marcar todas como leídas
    return await this.notificationRepository.markAllAsRead(userId);
  }
}