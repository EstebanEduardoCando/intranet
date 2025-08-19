/**
 * Role Module Permission entity for CRUD permissions at module level
 */
export interface RoleModulePermission {
  /** Unique permission identifier */
  permissionId: number;
  
  /** Role ID */
  roleId: number;
  
  /** Module ID */
  moduleId: string;
  
  /** Can view module */
  canView: boolean;
  
  /** Can create in module */
  canCreate: boolean;
  
  /** Can edit in module */
  canEdit: boolean;
  
  /** Can delete in module */
  canDelete: boolean;
  
  /** Can execute actions in module */
  canExecute: boolean;
  
  /** Timestamp when the permission was created */
  createdAt: Date;
  
  /** Timestamp when the permission was last updated */
  updatedAt: Date;
}

/**
 * Role Function Permission entity for granular permissions at function level
 */
export interface RoleFunctionPermission {
  /** Unique permission identifier */
  permissionId: number;
  
  /** Role ID */
  roleId: number;
  
  /** Function ID */
  functionId: number;
  
  /** Whether the function is enabled for this role */
  isEnabled: boolean;
  
  /** Timestamp when the permission was created */
  createdAt: Date;
  
  /** Timestamp when the permission was last updated */
  updatedAt: Date;
}

/**
 * Complete role with permissions data
 */
export interface RoleWithPermissions {
  roleId: number;
  name: string;
  description?: string;
  isActive: boolean;
  isDeleted: boolean;
  version?: number;
  createdBy?: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
  
  /** Module permissions */
  modulePermissions: RoleModulePermission[];
  
  /** Function permissions */
  functionPermissions: RoleFunctionPermission[];
}

/**
 * Permission update data for a specific module
 */
export interface UpdateModulePermissionData {
  moduleId: string;
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canExecute: boolean;
}

/**
 * Permission update data for a specific function
 */
export interface UpdateFunctionPermissionData {
  functionId: number;
  isEnabled: boolean;
}

/**
 * Bulk permission update for a role
 */
export interface UpdateRolePermissionsData {
  roleId: number;
  modulePermissions: UpdateModulePermissionData[];
  functionPermissions: UpdateFunctionPermissionData[];
}