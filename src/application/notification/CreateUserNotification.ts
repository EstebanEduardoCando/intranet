import { UserNotificationRepository } from '../../domain/notification/UserNotificationRepository';
import { CreateUserNotificationData } from '../../domain/notification/UserNotification';

export class CreateUserNotification {
  constructor(private notificationRepository: UserNotificationRepository) {}

  async execute(data: CreateUserNotificationData): Promise<number> {
    // Validaciones
    if (!data.userId.trim()) {
      throw new Error('User ID is required');
    }

    if (!data.title.trim()) {
      throw new Error('Title is required');
    }

    if (!data.message.trim()) {
      throw new Error('Message is required');
    }

    if (!['success', 'error', 'warning', 'info'].includes(data.type)) {
      throw new Error('Invalid notification type');
    }

    if (data.priority && (data.priority < 1 || data.priority > 5)) {
      throw new Error('Priority must be between 1 and 5');
    }

    // Crear la notificación
    return await this.notificationRepository.create(data);
  }
}