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
  sort_order: number;
  is_active: boolean;
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
      moduleId: row.module_id,
      parentId: row.parent_id || undefined,
      code: row.code,
      name: row.name,
      description: row.description || undefined,
      icon: row.icon || undefined,
      sortOrder: row.sort_order,
      isActive: row.is_active,
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
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return null; // No rows returned
      }
      throw new Error(`Failed to find module by code: ${error.message}`);
    }
    
    return this.mapRowToModule(data);
  }
}