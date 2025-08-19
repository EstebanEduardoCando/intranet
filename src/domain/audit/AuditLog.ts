export interface AuditLog {
  auditId: number;
  tableName: string;
  recordId: string;
  operationType: 'CREATE' | 'UPDATE' | 'DELETE' | 'RESTORE';
  
  // Datos del cambio
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  changedFields?: string[];
  
  // Información del usuario
  userId: string;
  userEmail?: string;
  userRole?: string;
  
  // Información del contexto
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
  
  // Timestamps
  createdAt: Date;
  
  // Metadata adicional
  comment?: string;
  tags?: string[];
}

export interface CreateAuditLogData {
  tableName: string;
  recordId: string;
  operationType: 'CREATE' | 'UPDATE' | 'DELETE' | 'RESTORE';
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  userId: string;
  comment?: string;
  tags?: string[];
}

export interface AuditLogFilter {
  tableName?: string;
  recordId?: string;
  operationType?: 'CREATE' | 'UPDATE' | 'DELETE' | 'RESTORE';
  userId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  searchText?: string;
  tags?: string[];
}

export interface AuditLogDetailed extends AuditLog {
  userFullName?: string;
  username?: string;
}

export interface RecentChangesSummary {
  tableName: string;
  operationType: string;
  changeCount: number;
  lastChange: Date;
  usersInvolved: number;
}