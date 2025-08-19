import { AuditRepository } from '../../domain/audit/AuditRepository';
import { AuditLogDetailed } from '../../domain/audit/AuditLog';

export class GetRecordHistory {
  constructor(private auditRepository: AuditRepository) {}

  async execute(tableName: string, recordId: string): Promise<AuditLogDetailed[]> {
    // Validaciones
    if (!tableName.trim()) {
      throw new Error('Table name is required');
    }

    if (!recordId.trim()) {
      throw new Error('Record ID is required');
    }

    // Obtener historial del registro
    return await this.auditRepository.getRecordHistory(tableName, recordId);
  }
}