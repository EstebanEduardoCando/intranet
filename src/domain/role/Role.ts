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
  
  /** Whether the role is active */
  isActive: boolean;
  
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
}

/**
 * Role update data
 */
export interface UpdateRoleData {
  name?: string;
  description?: string;
  isActive?: boolean;
}