import { AuditRepository } from '../../domain/audit/AuditRepository';
import { RecentChangesSummary } from '../../domain/audit/AuditLog';

export class GetAuditStats {
  constructor(private auditRepository: AuditRepository) {}

  async execute(userId?: string): Promise<{
    totalChanges: number;
    changesByType: Record<string, number>;
    changesByTable: Record<string, number>;
    mostActiveUsers: Array<{ userId: string; userFullName: string; changeCount: number }>;
    recentChanges: RecentChangesSummary[];
  }> {
    // Obtener estadísticas generales
    const stats = await this.auditRepository.getAuditStats(userId);
    
    // Obtener resumen de cambios recientes
    const recentChanges = await this.auditRepository.getRecentChangesSummary(7);

    return {
      ...stats,
      recentChanges
    };
  }
}