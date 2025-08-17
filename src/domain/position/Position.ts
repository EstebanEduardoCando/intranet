/**
 * Position entity representing a job position
 */
export interface Position {
  /** Unique position identifier */
  positionId: number;
  
  /** Position name */
  name: string;
  
  /** Position description */
  description?: string;
  
  /** Department this position belongs to */
  department?: string;
  
  /** Whether the position is active */
  isActive: boolean;
  
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
  department?: string;
}

/**
 * Position update data
 */
export interface UpdatePositionData {
  name?: string;
  description?: string;
  department?: string;
  isActive?: boolean;
}