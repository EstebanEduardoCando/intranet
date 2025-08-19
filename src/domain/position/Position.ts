/**
 * Position entity representing a job position
 */
export interface Position {
  /** Unique position identifier */
  positionId: number;
  
  /** Position title */
  title: string;
  
  /** Position name (alias for title) */
  name: string;
  
  /** Position description */
  description?: string;
  
  /** Department this position belongs to */
  department?: string;
  
  /** Position level (Junior, Senior, Lead, etc.) */
  level?: string;
  
  /** Position requirements */
  requirements?: string;
  
  /** Company this position belongs to */
  companyId: string;
  
  /** Whether the position is active */
  isActive: boolean;
  
  /** Whether the position is deleted (soft delete) */
  isDeleted: boolean;
  
  /** Version for optimistic locking */
  version?: number;
  
  /** User who created the position */
  createdBy?: string;
  
  /** User who last updated the position */
  updatedBy?: string;
  
  /** Timestamp when the position was created */
  createdAt: Date;
  
  /** Timestamp when the position was last updated */
  updatedAt: Date;
}

/**
 * Position creation data
 */
export interface CreatePositionData {
  title: string;
  name: string;
  description?: string;
  department?: string;
  level?: string;
  requirements?: string;
  companyId: string;
}

/**
 * Position update data
 */
export interface UpdatePositionData {
  title?: string;
  name?: string;
  description?: string;
  department?: string;
  level?: string;
  requirements?: string;
  companyId?: string;
  isActive?: boolean;
  isDeleted?: boolean;
}