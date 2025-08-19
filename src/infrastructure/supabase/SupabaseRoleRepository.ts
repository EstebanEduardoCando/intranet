import { RoleRepository } from '../../domain/role/RoleRepository';
import { Role, UserRole, CreateRoleData, UpdateRoleData } from '../../domain/role/Role';
import { 
  RoleWithPermissions, 
  UpdateRolePermissionsData,
  RoleModulePermission,
  RoleFunctionPermission
} from '../../domain/role/RolePermission';
import { supabase } from './supabaseClient';

/**
 * Database row structure for roles table
 */
interface RoleRow {
  role_id: number;
  name: string;
  description: string | null;
  is_active: boolean;
  is_deleted?: boolean;
  created_by?: string | null;
  updated_by?: string | null;
  version?: number;
  created_at: string;
  updated_at: string;
}

/**
 * Database row structure for user_roles table (REAL STRUCTURE)
 */
interface UserRoleRow {
  user_role_id?: number;
  user_id: string;
  role_id: number;
  company_id?: number | null;
  start_date?: string;
  end_date?: string | null;
  created_at?: string;
  assigned_at?: string;
  assigned_by?: string | null;
}

/**
 * Database row structure for role_module_permissions table
 */
interface RoleModulePermissionRow {
  permission_id: number;
  role_id: number;
  module_id: number;
  can_view: boolean;
  can_create: boolean;
  can_edit: boolean;
  can_delete: boolean;
  can_execute: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Database row structure for role_function_permissions table
 */
interface RoleFunctionPermissionRow {
  permission_id: number;
  role_id: number;
  function_id: number;
  is_enabled: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Supabase implementation of RoleRepository
 */
export class SupabaseRoleRepository implements RoleRepository {
  
  private mapRowToRole(row: RoleRow): Role {
    return {
      roleId: row.role_id,
      name: row.name,
      description: row.description || undefined,
      isActive: row.is_active,
      isDeleted: row.is_deleted || false,
      version: row.version,
      createdBy: row.created_by || undefined,
      updatedBy: row.updated_by || undefined,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    };
  }

  private mapRowToUserRole(row: UserRoleRow | any): UserRole {
    return {
      userId: row.user_id,
      roleId: row.role_id,
      assignedAt: row.assigned_at ? new Date(row.assigned_at) : new Date(),
      assignedBy: row.assigned_by || undefined
    };
  }

  private mapRowToModulePermission(row: RoleModulePermissionRow): RoleModulePermission {
    return {
      permissionId: row.permission_id,
      roleId: row.role_id,
      moduleId: row.module_id.toString(),
      canView: row.can_view,
      canCreate: row.can_create,
      canEdit: row.can_edit,
      canDelete: row.can_delete,
      canExecute: row.can_execute,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    };
  }

  private mapRowToFunctionPermission(row: RoleFunctionPermissionRow): RoleFunctionPermission {
    return {
      permissionId: row.permission_id,
      roleId: row.role_id,
      functionId: row.function_id,
      isEnabled: row.is_enabled,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    };
  }

  async findAll(): Promise<Role[]> {
    try {
      const { data, error } = await supabase
        .from('roles')
        .select('*')
        .eq('is_active', true)
        .eq('is_deleted', false)
        .order('name');

      if (error) {
        throw new Error(`Failed to find roles: ${error.message}`);
      }

      return data.map(row => this.mapRowToRole(row));
    } catch (error) {
      throw new Error(`Failed to find all roles: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async findById(id: number): Promise<Role | null> {
    try {
      const { data, error } = await supabase
        .from('roles')
        .select('*')
        .eq('role_id', id)
        .eq('is_deleted', false)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw new Error(`Failed to find role: ${error.message}`);
      }

      return this.mapRowToRole(data);
    } catch (error) {
      throw new Error(`Failed to find role by ID: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async findByUserId(userId: string): Promise<Role[]> {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select(`
          roles!inner (
            role_id,
            name,
            description,
            is_active,
            created_at,
            updated_at
          )
        `)
        .eq('user_id', userId);

      if (error) {
        throw new Error(`Failed to find roles by user ID: ${error.message}`);
      }

      return data.map(item => this.mapRowToRole(item.roles as unknown as RoleRow)).filter(role => role.isActive);
    } catch (error) {
      throw new Error(`Failed to find roles by user ID: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async create(data: CreateRoleData, userId?: string): Promise<Role> {
    try {
      const { data: result, error } = await supabase
        .from('roles')
        .insert({
          name: data.name,
          description: data.description || null,
          is_active: true,
          created_by: userId || null,
          updated_by: userId || null,
          version: 1,
          is_deleted: false
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to create role: ${error.message}`);
      }

      return this.mapRowToRole(result);
    } catch (error) {
      throw new Error(`Failed to create role: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async update(id: number, data: UpdateRoleData, userId?: string): Promise<Role | null> {
    try {
      const updateData: Partial<RoleRow> = {
        updated_at: new Date().toISOString(),
        updated_by: userId || null
      };

      if (data.name !== undefined) updateData.name = data.name;
      if (data.description !== undefined) updateData.description = data.description || null;
      if (data.isActive !== undefined) updateData.is_active = data.isActive;

      const { data: result, error } = await supabase
        .from('roles')
        .update(updateData)
        .eq('role_id', id)
        .select()
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw new Error(`Failed to update role: ${error.message}`);
      }

      return this.mapRowToRole(result);
    } catch (error) {
      throw new Error(`Failed to update role: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async delete(id: number, userId?: string): Promise<boolean> {
    try {
      // Soft delete by setting is_active to false
      const { error } = await supabase
        .from('roles')
        .update({ 
          is_deleted: true,
          is_active: false,
          updated_at: new Date().toISOString(),
          updated_by: userId || null
        })
        .eq('role_id', id);

      if (error) {
        throw new Error(`Failed to delete role: ${error.message}`);
      }

      return true;
    } catch (error) {
      throw new Error(`Failed to delete role: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async assignToUser(userId: string, roleId: number, assignedBy?: string): Promise<UserRole> {
    try {
      const insertData: any = {
        user_id: userId,
        role_id: roleId,
        start_date: new Date().toISOString().split('T')[0] // Today's date in YYYY-MM-DD format
      };

      // Only include assigned_by if it's a valid UUID, otherwise leave it null
      if (assignedBy && this.isValidUUID(assignedBy)) {
        insertData.assigned_by = assignedBy;
      }

      const { data: result, error } = await supabase
        .from('user_roles')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to assign role to user: ${error.message}`);
      }

      return this.mapRowToUserRole(result);
    } catch (error) {
      throw new Error(`Failed to assign role to user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

  async removeFromUser(userId: string, roleId: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role_id', roleId);

      if (error) {
        throw new Error(`Failed to remove role from user: ${error.message}`);
      }

      return true;
    } catch (error) {
      throw new Error(`Failed to remove role from user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async findByIdWithPermissions(id: number): Promise<RoleWithPermissions | null> {
    try {
      const role = await this.findById(id);
      if (!role) return null;

      const [modulePermissions, functionPermissions] = await Promise.all([
        this.getModulePermissions(id),
        this.getFunctionPermissions(id)
      ]);

      return {
        ...role,
        modulePermissions,
        functionPermissions
      };
    } catch (error) {
      throw new Error(`Failed to find role with permissions: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getModulePermissions(roleId: number): Promise<RoleModulePermission[]> {
    try {
      const { data, error } = await supabase
        .from('role_module_permissions')
        .select('*')
        .eq('role_id', roleId)
        .order('module_id');

      if (error) {
        throw new Error(`Failed to get module permissions: ${error.message}`);
      }

      return data.map(row => this.mapRowToModulePermission(row));
    } catch (error) {
      throw new Error(`Failed to get module permissions: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getFunctionPermissions(roleId: number): Promise<RoleFunctionPermission[]> {
    try {
      const { data, error } = await supabase
        .from('role_function_permissions')
        .select('*')
        .eq('role_id', roleId)
        .order('function_id');

      if (error) {
        throw new Error(`Failed to get function permissions: ${error.message}`);
      }

      return data.map(row => this.mapRowToFunctionPermission(row));
    } catch (error) {
      throw new Error(`Failed to get function permissions: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updatePermissions(data: UpdateRolePermissionsData, updatedBy?: string): Promise<boolean> {
    try {
      // Start transaction-like approach
      
      // 1. Delete existing module permissions
      const { error: deleteModuleError } = await supabase
        .from('role_module_permissions')
        .delete()
        .eq('role_id', data.roleId);

      if (deleteModuleError) {
        throw new Error(`Failed to delete existing module permissions: ${deleteModuleError.message}`);
      }

      // 2. Delete existing function permissions
      const { error: deleteFunctionError } = await supabase
        .from('role_function_permissions')
        .delete()
        .eq('role_id', data.roleId);

      if (deleteFunctionError) {
        throw new Error(`Failed to delete existing function permissions: ${deleteFunctionError.message}`);
      }

      // 3. Insert new module permissions
      if (data.modulePermissions.length > 0) {
        const modulePermissionsData = data.modulePermissions.map(mp => ({
          role_id: data.roleId,
          module_id: parseInt(mp.moduleId),
          can_view: mp.canView,
          can_create: mp.canCreate,
          can_edit: mp.canEdit,
          can_delete: mp.canDelete,
          can_execute: mp.canExecute
        }));

        const { error: insertModuleError } = await supabase
          .from('role_module_permissions')
          .insert(modulePermissionsData);

        if (insertModuleError) {
          throw new Error(`Failed to insert module permissions: ${insertModuleError.message}`);
        }
      }

      // 4. Insert new function permissions
      if (data.functionPermissions.length > 0) {
        const functionPermissionsData = data.functionPermissions.map(fp => ({
          role_id: data.roleId,
          function_id: fp.functionId,
          is_enabled: fp.isEnabled
        }));

        const { error: insertFunctionError } = await supabase
          .from('role_function_permissions')
          .insert(functionPermissionsData);

        if (insertFunctionError) {
          throw new Error(`Failed to insert function permissions: ${insertFunctionError.message}`);
        }
      }

      return true;
    } catch (error) {
      throw new Error(`Failed to update permissions: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}