import { supabase } from './supabaseClient';
import { Module } from '../../domain/modules/Module';

/**
 * Database row structure for modules table
 */
interface ModuleRow {
  module_id: number;
  parent_id: number | null;
  code: string;
  name: string;
  description: string | null;
  icon: string | null;
  route: string | null;
  sort_order: number;
  is_visible: boolean;
  is_active: boolean;
  required_role: string | null;
  created_by: string | null;
  updated_by: string | null;
  version: number;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Supabase implementation for Module repository
 */
export class SupabaseModuleRepository {
  
  /**
   * Convert database row to domain Module entity
   */
  private mapRowToModule(row: ModuleRow): Module {
    return {
      moduleId: row.module_id.toString(),
      parentId: row.parent_id?.toString(),
      code: row.code,
      name: row.name,
      description: row.description || undefined,
      icon: row.icon || undefined,
      route: row.route || undefined,
      order: row.sort_order,
      sortOrder: row.sort_order,
      isVisible: row.is_visible,
      isActive: row.is_active,
      requiredRole: row.required_role || undefined,
      version: row.version,
      createdBy: row.created_by || undefined,
      updatedBy: row.updated_by || undefined,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    };
  }
  
  /**
   * Get all active modules
   */
  async getAllActiveModules(): Promise<Module[]> {
    const { data, error } = await supabase
      .from('modules')
      .select('*')
      .eq('is_active', true)
      .eq('is_deleted', false)
      .order('sort_order', { ascending: true });
    
    if (error) {
      throw new Error(`Failed to fetch modules: ${error.message}`);
    }
    
    return data.map(row => this.mapRowToModule(row));
  }
  
  /**
   * Get modules by parent ID
   */
  async getModulesByParent(parentId: number | null): Promise<Module[]> {
    const query = supabase
      .from('modules')
      .select('*')
      .eq('is_active', true)
      .eq('is_deleted', false)
      .order('sort_order', { ascending: true });
    
    if (parentId === null) {
      query.is('parent_id', null);
    } else {
      query.eq('parent_id', parentId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      throw new Error(`Failed to fetch modules by parent: ${error.message}`);
    }
    
    return data.map(row => this.mapRowToModule(row));
  }
  
  /**
   * Get main modules (parent_id = null)
   */
  async getMainModules(): Promise<Module[]> {
    return this.getModulesByParent(null);
  }
  
  /**
   * Get module by ID
   */
  async getModuleById(moduleId: number): Promise<Module | null> {
    const { data, error } = await supabase
      .from('modules')
      .select('*')
      .eq('module_id', moduleId)
      .eq('is_active', true)
      .eq('is_deleted', false)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return null; // No rows returned
      }
      throw new Error(`Failed to find module by ID: ${error.message}`);
    }
    
    return this.mapRowToModule(data);
  }
  
  /**
   * Get module by code
   */
  async getModuleByCode(code: string): Promise<Module | null> {
    const { data, error } = await supabase
      .from('modules')
      .select('*')
      .eq('code', code)
      .eq('is_active', true)
      .eq('is_deleted', false)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return null; // No rows returned
      }
      throw new Error(`Failed to find module by code: ${error.message}`);
    }
    
    return this.mapRowToModule(data);
  }

  /**
   * Create a new module
   */
  async create(moduleData: Partial<Module>, userId: string): Promise<Module> {
    const insertData = {
      parent_id: moduleData.parentId ? parseInt(moduleData.parentId) : null,
      code: moduleData.code,
      name: moduleData.name,
      description: moduleData.description || null,
      icon: moduleData.icon || null,
      route: moduleData.route || null,
      sort_order: moduleData.order || moduleData.sortOrder || 0,
      is_visible: moduleData.isVisible !== false,
      is_active: moduleData.isActive !== false,
      required_role: moduleData.requiredRole || null,
      created_by: userId,
      updated_by: userId,
      version: 1,
      is_deleted: false
    };

    const { data, error } = await supabase
      .from('modules')
      .insert(insertData)
      .select('*')
      .single();

    if (error) {
      throw new Error(`Failed to create module: ${error.message}`);
    }

    return this.mapRowToModule(data);
  }

  /**
   * Update an existing module
   */
  async update(moduleId: string, moduleData: Partial<Module>, userId: string): Promise<Module> {
    const updateData: any = {
      updated_by: userId,
      updated_at: new Date().toISOString()
    };

    if (moduleData.parentId !== undefined) updateData.parent_id = moduleData.parentId ? parseInt(moduleData.parentId) : null;
    if (moduleData.code !== undefined) updateData.code = moduleData.code;
    if (moduleData.name !== undefined) updateData.name = moduleData.name;
    if (moduleData.description !== undefined) updateData.description = moduleData.description;
    if (moduleData.icon !== undefined) updateData.icon = moduleData.icon;
    if (moduleData.route !== undefined) updateData.route = moduleData.route;
    if (moduleData.order !== undefined) updateData.sort_order = moduleData.order;
    if (moduleData.sortOrder !== undefined) updateData.sort_order = moduleData.sortOrder;
    if (moduleData.isVisible !== undefined) updateData.is_visible = moduleData.isVisible;
    if (moduleData.isActive !== undefined) updateData.is_active = moduleData.isActive;
    if (moduleData.requiredRole !== undefined) updateData.required_role = moduleData.requiredRole;

    const { data, error } = await supabase
      .from('modules')
      .update(updateData)
      .eq('module_id', parseInt(moduleId))
      .eq('is_deleted', false)
      .select('*')
      .single();

    if (error) {
      throw new Error(`Failed to update module: ${error.message}`);
    }

    return this.mapRowToModule(data);
  }

  /**
   * Soft delete a module
   */
  async delete(moduleId: string, userId: string): Promise<boolean> {
    const { error } = await supabase
      .from('modules')
      .update({
        is_deleted: true,
        is_active: false,
        updated_by: userId,
        updated_at: new Date().toISOString()
      })
      .eq('module_id', parseInt(moduleId));

    if (error) {
      throw new Error(`Failed to delete module: ${error.message}`);
    }

    return true;
  }

  /**
   * Get all modules including deleted (for admin)
   */
  async getAllModules(): Promise<Module[]> {
    const { data, error } = await supabase
      .from('modules')
      .select('*')
      .eq('is_deleted', false)
      .order('sort_order', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch all modules: ${error.message}`);
    }

    return data.map(row => this.mapRowToModule(row));
  }
}