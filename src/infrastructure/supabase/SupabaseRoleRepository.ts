import { RoleRepository } from '../../domain/role/RoleRepository';
import { Role, UserRole, CreateRoleData, UpdateRoleData } from '../../domain/role/Role';
import { supabase } from './supabaseClient';

/**
 * Database row structure for roles table
 */
interface RoleRow {
  role_id: number;
  name: string;
  description: string | null;
  is_active: boolean;
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
 * Supabase implementation of RoleRepository
 */
export class SupabaseRoleRepository implements RoleRepository {
  
  private mapRowToRole(row: RoleRow): Role {
    return {
      roleId: row.role_id,
      name: row.name,
      description: row.description || undefined,
      isActive: row.is_active,
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

  async findAll(): Promise<Role[]> {
    try {
      const { data, error } = await supabase
        .from('roles')
        .select('*')
        .eq('is_active', true)
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

  async create(data: CreateRoleData): Promise<Role> {
    try {
      const { data: result, error } = await supabase
        .from('roles')
        .insert({
          name: data.name,
          description: data.description || null,
          is_active: true
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

  async update(id: number, data: UpdateRoleData): Promise<Role | null> {
    try {
      const updateData: Partial<RoleRow> = {
        updated_at: new Date().toISOString()
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

  async delete(id: number): Promise<boolean> {
    try {
      // Soft delete by setting is_active to false
      const { error } = await supabase
        .from('roles')
        .update({ 
          is_active: false,
          updated_at: new Date().toISOString()
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
}