import { UserNotificationRepository } from '../../domain/notification/UserNotificationRepository';

export class MarkNotificationAsRead {
  constructor(private notificationRepository: UserNotificationRepository) {}

  async execute(notificationId: number, userId: string): Promise<void> {
    // Validaciones
    if (!userId.trim()) {
      throw new Error('User ID is required');
    }

    if (!notificationId || notificationId <= 0) {
      throw new Error('Valid notification ID is required');
    }

    // Verificar que la notificación existe y pertenece al usuario
    const notification = await this.notificationRepository.getById(notificationId, userId);
    if (!notification) {
      throw new Error('Notification not found or does not belong to user');
    }

    // Marcar como leída si no lo está ya
    if (!notification.isRead) {
      await this.notificationRepository.markAsRead(notificationId, userId);
    }
  }
}