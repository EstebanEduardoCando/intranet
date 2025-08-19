import { Role, UserRole, CreateRoleData, UpdateRoleData } from './Role';

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
}