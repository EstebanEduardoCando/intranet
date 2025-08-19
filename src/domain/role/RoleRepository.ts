import { Role, UserRole, CreateRoleData, UpdateRoleData } from './Role';
import { 
  RoleWithPermissions, 
  UpdateRolePermissionsData,
  RoleModulePermission,
  RoleFunctionPermission
} from './RolePermission';

/**
 * Repository interface for role operations
 */
export interface RoleRepository {
  /**
   * Find all active roles
   * @returns Promise resolving to array of roles
   */
  findAll(): Promise<Role[]>;
  
  /**
   * Find role by ID
   * @param id Role ID to search for
   * @returns Promise resolving to Role or null if not found
   */
  findById(id: number): Promise<Role | null>;
  
  /**
   * Find roles by user ID
   * @param userId User ID to search roles for
   * @returns Promise resolving to array of roles
   */
  findByUserId(userId: string): Promise<Role[]>;
  
  /**
   * Create new role
   * @param data Role creation data
   * @returns Promise resolving to the created Role
   */
  create(data: CreateRoleData): Promise<Role>;
  
  /**
   * Update role
   * @param id Role ID to update
   * @param data Role update data
   * @returns Promise resolving to updated Role or null if not found
   */
  update(id: number, data: UpdateRoleData): Promise<Role | null>;
  
  /**
   * Delete role by ID
   * @param id Role ID to delete
   * @returns Promise resolving to boolean indicating success
   */
  delete(id: number): Promise<boolean>;
  
  /**
   * Assign role to user
   * @param userId User ID
   * @param roleId Role ID
   * @param assignedBy User ID who assigns the role
   * @returns Promise resolving to UserRole
   */
  assignToUser(userId: string, roleId: number, assignedBy?: string): Promise<UserRole>;
  
  /**
   * Remove role from user
   * @param userId User ID
   * @param roleId Role ID
   * @returns Promise resolving to boolean indicating success
   */
  removeFromUser(userId: string, roleId: number): Promise<boolean>;

  /**
   * Find role with complete permissions
   * @param id Role ID
   * @returns Promise resolving to RoleWithPermissions or null if not found
   */
  findByIdWithPermissions(id: number): Promise<RoleWithPermissions | null>;

  /**
   * Get module permissions for a role
   * @param roleId Role ID
   * @returns Promise resolving to array of module permissions
   */
  getModulePermissions(roleId: number): Promise<RoleModulePermission[]>;

  /**
   * Get function permissions for a role
   * @param roleId Role ID
   * @returns Promise resolving to array of function permissions
   */
  getFunctionPermissions(roleId: number): Promise<RoleFunctionPermission[]>;

  /**
   * Update role permissions
   * @param data Permission update data
   * @param updatedBy User ID who updates the permissions
   * @returns Promise resolving to boolean indicating success
   */
  updatePermissions(data: UpdateRolePermissionsData, updatedBy?: string): Promise<boolean>;
}