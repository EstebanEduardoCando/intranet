/**
 * Position entity representing a job position catalog
 * This is a standalone catalog, not tied to specific companies or departments
 */
export interface Position {
  /** Unique position identifier */
  positionId: number;
  
  /** Position name/title */
  name: string;
  
  /** Position description */
  description?: string;
  
  /** Position level (Junior, Senior, Lead, Manager, Director, etc.) */
  level?: string;
  
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
  name: string;
  description?: string;
  level?: string;
}

/**
 * Position update data
 */
export interface UpdatePositionData {
  name?: string;
  description?: string;
  level?: string;
  isActive?: boolean;
  isDeleted?: boolean;
}