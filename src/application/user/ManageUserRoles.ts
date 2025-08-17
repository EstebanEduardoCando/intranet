import { Role } from '../../domain/role/Role';
import { RoleRepository } from '../../domain/role/RoleRepository';
import { UserRepository } from '../../domain/user/UserRepository';

export interface AssignRoleRequest {
  userId: string;
  roleId: number;
  assignedBy?: string;
}

export interface RemoveRoleRequest {
  userId: string;
  roleId: number;
}

export class ManageUserRoles {
  constructor(
    private userRepository: UserRepository,
    private roleRepository: RoleRepository
  ) {}

  async assignRole(request: AssignRoleRequest): Promise<void> {
    const { userId, roleId, assignedBy } = request;

    if (!userId) {
      throw new Error('User ID is required');
    }

    if (!roleId) {
      throw new Error('Role ID is required');
    }

    try {
      // Check if user exists
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Check if role exists
      const role = await this.roleRepository.findById(roleId);
      if (!role) {
        throw new Error('Role not found');
      }

      // Check if user already has this role
      const userRoles = await this.roleRepository.findByUserId(userId);
      const hasRole = userRoles.some(r => r.roleId === roleId);
      
      if (hasRole) {
        throw new Error('User already has this role');
      }

      // Assign role to user
      await this.roleRepository.assignToUser(userId, roleId, assignedBy);
    } catch (error) {
      throw new Error(`Error assigning role to user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async removeRole(request: RemoveRoleRequest): Promise<void> {
    const { userId, roleId } = request;

    if (!userId) {
      throw new Error('User ID is required');
    }

    if (!roleId) {
      throw new Error('Role ID is required');
    }

    try {
      // Check if user exists
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Check if user has this role
      const userRoles = await this.roleRepository.findByUserId(userId);
      const hasRole = userRoles.some(r => r.roleId === roleId);
      
      if (!hasRole) {
        throw new Error('User does not have this role');
      }

      // Remove role from user
      const success = await this.roleRepository.removeFromUser(userId, roleId);
      
      if (!success) {
        throw new Error('Failed to remove role from user');
      }
    } catch (error) {
      throw new Error(`Error removing role from user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getUserRoles(userId: string): Promise<Role[]> {
    if (!userId) {
      throw new Error('User ID is required');
    }

    try {
      // Check if user exists
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      return await this.roleRepository.findByUserId(userId);
    } catch (error) {
      throw new Error(`Error fetching user roles: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}