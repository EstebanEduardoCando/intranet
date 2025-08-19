import { AuditLog, CreateAuditLogData, AuditLogFilter, AuditLogDetailed, RecentChangesSummary } from './AuditLog';

export interface AuditRepository {
  // Crear log de auditoría
  createAuditLog(data: CreateAuditLogData): Promise<number>;
  
  // Obtener logs de auditoría con filtros
  getAuditLogs(filter?: AuditLogFilter, limit?: number, offset?: number): Promise<AuditLogDetailed[]>;
  
  // Obtener historial de un registro específico
  getRecordHistory(tableName: string, recordId: string): Promise<AuditLogDetailed[]>;
  
  // Obtener resumen de cambios recientes
  getRecentChangesSummary(days?: number): Promise<RecentChangesSummary[]>;
  
  // Obtener estadísticas de auditoría
  getAuditStats(userId?: string): Promise<{
    totalChanges: number;
    changesByType: Record<string, number>;
    changesByTable: Record<string, number>;
    mostActiveUsers: Array<{ userId: string; userFullName: string; changeCount: number }>;
  }>;
  
  // Limpiar logs antiguos
  cleanOldLogs(olderThanDays: number): Promise<number>;
}