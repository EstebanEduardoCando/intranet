import { Module, buildModuleHierarchy } from '../../domain/modules/Module';
import { SupabaseModuleRepository } from '../../infrastructure/supabase/SupabaseModuleRepository';

/**
 * Use case for getting modules
 * This is part of the application layer in hexagonal architecture
 * TODO: Implementar filtrado por usuario - GetModules.ts:8 - Prioridad: Media
 */
export class GetModules {
  constructor(private moduleRepository: SupabaseModuleRepository) {}

  /**
   * Get all active modules with hierarchical structure
   * TODO: Future - filter modules based on user permissions
   * @returns Promise resolving to hierarchical module structure
   */
  async execute(): Promise<Module[]> {
    try {
      // Get all active modules from repository
      const modules = await this.moduleRepository.getAllActiveModules();
      
      // Build hierarchical structure
      const hierarchicalModules = buildModuleHierarchy(modules);
      
      return hierarchicalModules;
    } catch (error) {
      throw new Error(
        error instanceof Error 
          ? error.message 
          : 'Error al obtener módulos'
      );
    }
  }

  /**
   * Get main modules only (no children)
   * @returns Promise resolving to main modules
   */
  async getMainModules(): Promise<Module[]> {
    try {
      return await this.moduleRepository.getMainModules();
    } catch (error) {
      throw new Error(
        error instanceof Error 
          ? error.message 
          : 'Error al obtener módulos principales'
      );
    }
  }

  /**
   * Get modules by parent ID
   * @param parentId Parent module ID
   * @returns Promise resolving to child modules
   */
  async getModulesByParent(parentId: number): Promise<Module[]> {
    try {
      return await this.moduleRepository.getModulesByParent(parentId);
    } catch (error) {
      throw new Error(
        error instanceof Error 
          ? error.message 
          : 'Error al obtener submódulos'
      );
    }
  }
}