/**
 * Role entity representing user roles and permissions
 */
export interface Role {
  /** Unique role identifier */
  roleId: number;
  
  /** Role name */
  name: string;
  
  /** Role description */
  description?: string;
  
  /** Role permissions array */
  permissions?: string[];
  
  /** Whether the role is active */
  isActive: boolean;
  
  /** Whether the role is deleted (soft delete) */
  isDeleted: boolean;
  
  /** Version for optimistic locking */
  version?: number;
  
  /** User who created the role */
  createdBy?: string;
  
  /** User who last updated the role */
  updatedBy?: string;
  
  /** Timestamp when the role was created */
  createdAt: Date;
  
  /** Timestamp when the role was last updated */
  updatedAt: Date;
}

/**
 * UserRole entity for many-to-many relationship between users and roles
 */
export interface UserRole {
  /** User ID */
  userId: string;
  
  /** Role ID */
  roleId: number;
  
  /** Timestamp when the role was assigned */
  assignedAt: Date;
  
  /** User who assigned this role */
  assignedBy?: string;
}

/**
 * Role creation data
 */
export interface CreateRoleData {
  name: string;
  description?: string;
  permissions?: string[];
}

/**
 * Role update data
 */
export interface UpdateRoleData {
  name?: string;
  description?: string;
  permissions?: string[];
  isActive?: boolean;
  isDeleted?: boolean;
}