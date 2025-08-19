import { AuditRepository } from '../../domain/audit/AuditRepository';
import { AuditLogDetailed, AuditLogFilter } from '../../domain/audit/AuditLog';

export class GetAuditHistory {
  constructor(private auditRepository: AuditRepository) {}

  async execute(
    filter?: AuditLogFilter, 
    limit = 50, 
    offset = 0
  ): Promise<{
    logs: AuditLogDetailed[];
    hasMore: boolean;
  }> {
    // Validaciones
    if (limit < 1 || limit > 100) {
      throw new Error('Limit must be between 1 and 100');
    }

    if (offset < 0) {
      throw new Error('Offset must be non-negative');
    }

    // Obtener logs con un registro extra para verificar si hay más
    const logs = await this.auditRepository.getAuditLogs(filter, limit + 1, offset);
    
    // Verificar si hay más registros
    const hasMore = logs.length > limit;
    
    // Retornar solo el límite solicitado
    if (hasMore) {
      logs.pop();
    }

    return {
      logs,
      hasMore
    };
  }
}