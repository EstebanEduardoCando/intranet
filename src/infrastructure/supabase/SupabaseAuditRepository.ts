import { SupabaseClient } from '@supabase/supabase-js';
import { AuditRepository } from '../../domain/audit/AuditRepository';
import { AuditLog, CreateAuditLogData, AuditLogFilter, AuditLogDetailed, RecentChangesSummary } from '../../domain/audit/AuditLog';
import { supabase } from './supabaseClient';

export class SupabaseAuditRepository implements AuditRepository {
  constructor(private client: SupabaseClient = supabase) {}

  async createAuditLog(data: CreateAuditLogData): Promise<number> {
    const { data: result, error } = await this.client.rpc('create_audit_log', {
      p_table_name: data.tableName,
      p_record_id: data.recordId,
      p_operation_type: data.operationType,
      p_old_values: data.oldValues || null,
      p_new_values: data.newValues || null,
      p_user_id: data.userId,
      p_comment: data.comment || null
    });

    if (error) {
      throw new Error(`Error creating audit log: ${error.message}`);
    }

    return result as number;
  }

  async getAuditLogs(filter?: AuditLogFilter, limit = 50, offset = 0): Promise<AuditLogDetailed[]> {
    let query = this.client
      .from('audit_logs_detailed')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (filter) {
      if (filter.tableName) {
        query = query.eq('table_name', filter.tableName);
      }
      if (filter.recordId) {
        query = query.eq('record_id', filter.recordId);
      }
      if (filter.operationType) {
        query = query.eq('operation_type', filter.operationType);
      }
      if (filter.userId) {
        query = query.eq('user_id', filter.userId);
      }
      if (filter.dateFrom) {
        query = query.gte('created_at', filter.dateFrom.toISOString());
      }
      if (filter.dateTo) {
        query = query.lte('created_at', filter.dateTo.toISOString());
      }
      if (filter.searchText) {
        query = query.or(`user_email.ilike.%${filter.searchText}%,user_full_name.ilike.%${filter.searchText}%,comment.ilike.%${filter.searchText}%`);
      }
      if (filter.tags && filter.tags.length > 0) {
        query = query.contains('tags', filter.tags);
      }
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Error fetching audit logs: ${error.message}`);
    }

    return this.mapToAuditLogDetailed(data || []);
  }

  async getRecordHistory(tableName: string, recordId: string): Promise<AuditLogDetailed[]> {
    const { data, error } = await this.client.rpc('get_record_history', {
      p_table_name: tableName,
      p_record_id: recordId
    });

    if (error) {
      throw new Error(`Error fetching record history: ${error.message}`);
    }

    return (data || []).map((record: any) => ({
      auditId: record.audit_id,
      tableName,
      recordId,
      operationType: record.operation_type,
      changedFields: record.changed_fields,
      userId: '',
      createdAt: new Date(record.audit_timestamp),
      comment: record.comment,
      userFullName: record.user_full_name,
      oldValues: undefined,
      newValues: undefined
    }));
  }

  async getRecentChangesSummary(days = 7): Promise<RecentChangesSummary[]> {
    const { data, error } = await this.client
      .from('recent_changes_summary')
      .select('*')
      .order('last_change', { ascending: false });

    if (error) {
      throw new Error(`Error fetching recent changes summary: ${error.message}`);
    }

    return (data || []).map(record => ({
      tableName: record.table_name,
      operationType: record.operation_type,
      changeCount: record.change_count,
      lastChange: new Date(record.last_change),
      usersInvolved: record.users_involved
    }));
  }

  async getAuditStats(userId?: string): Promise<{
    totalChanges: number;
    changesByType: Record<string, number>;
    changesByTable: Record<string, number>;
    mostActiveUsers: Array<{ userId: string; userFullName: string; changeCount: number }>;
  }> {
    let baseQuery = this.client.from('audit_logs_detailed').select('*');
    
    if (userId) {
      baseQuery = baseQuery.eq('user_id', userId);
    }

    const { data, error } = await baseQuery;

    if (error) {
      throw new Error(`Error fetching audit stats: ${error.message}`);
    }

    const logs = data || [];
    
    // Calcular estadísticas
    const totalChanges = logs.length;
    
    const changesByType: Record<string, number> = {};
    const changesByTable: Record<string, number> = {};
    const userChanges: Record<string, { name: string; count: number }> = {};

    logs.forEach((log: any) => {
      // Por tipo
      changesByType[log.operation_type] = (changesByType[log.operation_type] || 0) + 1;
      
      // Por tabla
      changesByTable[log.table_name] = (changesByTable[log.table_name] || 0) + 1;
      
      // Por usuario
      if (log.user_id && log.user_full_name) {
        if (!userChanges[log.user_id]) {
          userChanges[log.user_id] = { name: log.user_full_name, count: 0 };
        }
        userChanges[log.user_id].count++;
      }
    });

    const mostActiveUsers = Object.entries(userChanges)
      .map(([userId, { name, count }]) => ({
        userId,
        userFullName: name,
        changeCount: count
      }))
      .sort((a, b) => b.changeCount - a.changeCount)
      .slice(0, 10);

    return {
      totalChanges,
      changesByType,
      changesByTable,
      mostActiveUsers
    };
  }

  async cleanOldLogs(olderThanDays: number): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

    const { count, error } = await this.client
      .from('audit_logs')
      .delete()
      .lt('created_at', cutoffDate.toISOString());

    if (error) {
      throw new Error(`Error cleaning old logs: ${error.message}`);
    }

    return count || 0;
  }

  private mapToAuditLogDetailed(records: any[]): AuditLogDetailed[] {
    return records.map(record => ({
      auditId: record.audit_id,
      tableName: record.table_name,
      recordId: record.record_id,
      operationType: record.operation_type,
      oldValues: record.old_values,
      newValues: record.new_values,
      changedFields: record.changed_fields,
      userId: record.user_id,
      userEmail: record.user_email,
      userRole: record.user_role,
      ipAddress: record.ip_address,
      userAgent: record.user_agent,
      sessionId: record.session_id,
      createdAt: new Date(record.created_at),
      comment: record.comment,
      tags: record.tags,
      userFullName: record.user_full_name,
      username: record.username
    }));
  }
}