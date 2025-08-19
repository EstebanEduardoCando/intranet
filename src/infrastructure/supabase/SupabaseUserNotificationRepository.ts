import { SupabaseClient } from '@supabase/supabase-js';
import { UserNotificationRepository } from '../../domain/notification/UserNotificationRepository';
import { UserNotification, CreateUserNotificationData, UserNotificationFilter } from '../../domain/notification/UserNotification';
import { supabase } from './supabaseClient';

export class SupabaseUserNotificationRepository implements UserNotificationRepository {
  constructor(private client: SupabaseClient = supabase) {}

  async create(data: CreateUserNotificationData): Promise<number> {
    const { data: result, error } = await this.client.rpc('create_user_notification', {
      p_user_id: data.userId,
      p_title: data.title,
      p_message: data.message,
      p_type: data.type,
      p_category: data.category || 'general',
      p_priority: data.priority || 3,
      p_data: data.data || null
    });

    if (error) {
      throw new Error(`Error creating user notification: ${error.message}`);
    }

    return result as number;
  }

  async getByUserId(filter: UserNotificationFilter, limit = 50, offset = 0): Promise<UserNotification[]> {
    let query = this.client
      .from('user_notifications')
      .select('*')
      .eq('user_id', filter.userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (filter.type) {
      query = query.eq('type', filter.type);
    }
    if (filter.category) {
      query = query.eq('category', filter.category);
    }
    if (filter.isRead !== undefined) {
      query = query.eq('is_read', filter.isRead);
    }
    if (filter.isDismissed !== undefined) {
      query = query.eq('is_dismissed', filter.isDismissed);
    }
    if (filter.priority) {
      query = query.eq('priority', filter.priority);
    }
    if (filter.dateFrom) {
      query = query.gte('created_at', filter.dateFrom.toISOString());
    }
    if (filter.dateTo) {
      query = query.lte('created_at', filter.dateTo.toISOString());
    }
    if (!filter.includeExpired) {
      query = query.or('expires_at.is.null,expires_at.gt.' + new Date().toISOString());
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Error fetching user notifications: ${error.message}`);
    }

    return this.mapToUserNotification(data || []);
  }

  async getById(notificationId: number, userId: string): Promise<UserNotification | null> {
    const { data, error } = await this.client
      .from('user_notifications')
      .select('*')
      .eq('notification_id', notificationId)
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // No encontrado
      }
      throw new Error(`Error fetching notification: ${error.message}`);
    }

    return this.mapToUserNotification([data])[0];
  }

  async markAsRead(notificationId: number, userId: string): Promise<void> {
    const { error } = await this.client
      .from('user_notifications')
      .update({
        is_read: true,
        read_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('notification_id', notificationId)
      .eq('user_id', userId);

    if (error) {
      throw new Error(`Error marking notification as read: ${error.message}`);
    }
  }

  async markAsDismissed(notificationId: number, userId: string): Promise<void> {
    const { error } = await this.client
      .from('user_notifications')
      .update({
        is_dismissed: true,
        dismissed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('notification_id', notificationId)
      .eq('user_id', userId);

    if (error) {
      throw new Error(`Error marking notification as dismissed: ${error.message}`);
    }
  }

  async markAllAsRead(userId: string): Promise<number> {
    const { count, error } = await this.client
      .from('user_notifications')
      .update({
        is_read: true,
        read_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) {
      throw new Error(`Error marking all notifications as read: ${error.message}`);
    }

    return count || 0;
  }

  async countUnread(userId: string): Promise<number> {
    const { count, error } = await this.client
      .from('user_notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_read', false)
      .eq('is_dismissed', false)
      .or('expires_at.is.null,expires_at.gt.' + new Date().toISOString());

    if (error) {
      throw new Error(`Error counting unread notifications: ${error.message}`);
    }

    return count || 0;
  }

  async deleteExpired(): Promise<number> {
    const { count, error } = await this.client
      .from('user_notifications')
      .delete()
      .not('expires_at', 'is', null)
      .lt('expires_at', new Date().toISOString());

    if (error) {
      throw new Error(`Error deleting expired notifications: ${error.message}`);
    }

    return count || 0;
  }

  async cleanOldNotifications(userId: string, keepLastCount: number): Promise<number> {
    // Obtener IDs de las notificaciones más recientes a mantener
    const { data: keepIds, error: selectError } = await this.client
      .from('user_notifications')
      .select('notification_id')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(keepLastCount);

    if (selectError) {
      throw new Error(`Error selecting notifications to keep: ${selectError.message}`);
    }

    if (!keepIds || keepIds.length === 0) {
      return 0;
    }

    const keepIdsList = keepIds.map(n => n.notification_id);

    // Eliminar las que no están en la lista de mantener
    const { count, error } = await this.client
      .from('user_notifications')
      .delete()
      .eq('user_id', userId)
      .not('notification_id', 'in', `(${keepIdsList.join(',')})`);

    if (error) {
      throw new Error(`Error cleaning old notifications: ${error.message}`);
    }

    return count || 0;
  }

  private mapToUserNotification(records: any[]): UserNotification[] {
    return records.map(record => ({
      notificationId: record.notification_id,
      userId: record.user_id,
      title: record.title,
      message: record.message,
      type: record.type,
      category: record.category,
      priority: record.priority,
      isRead: record.is_read,
      isDismissed: record.is_dismissed,
      readAt: record.read_at ? new Date(record.read_at) : undefined,
      dismissedAt: record.dismissed_at ? new Date(record.dismissed_at) : undefined,
      data: record.data,
      expiresAt: record.expires_at ? new Date(record.expires_at) : undefined,
      createdAt: new Date(record.created_at),
      updatedAt: new Date(record.updated_at)
    }));
  }
}