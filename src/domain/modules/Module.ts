/**
 * Module entity representing system modules and submodules
 */
export interface Module {
  /** Unique identifier for the module */
  moduleId: number;
  
  /** Parent module ID for hierarchical structure (null = main module) */
  parentId?: number;
  
  /** Unique code for the module (e.g., "ADMIN", "HR.EMPLOYEES") */
  code: string;
  
  /** Display name of the module */
  name: string;
  
  /** Description of the module */
  description?: string;
  
  /** Icon name/class for the module */
  icon?: string;
  
  /** Sort order for display */
  sortOrder: number;
  
  /** Whether the module is active */
  isActive: boolean;
  
  /** Timestamp when the module was created */
  createdAt: Date;
  
  /** Timestamp when the module was last updated */
  updatedAt: Date;
  
  /** Child modules (for hierarchical display) */
  children?: Module[];
}

/**
 * Module with navigation information
 */
export interface NavigationModule extends Module {
  /** Route path for navigation */
  path?: string;
  
  /** Whether user has access to this module */
  hasAccess?: boolean;
}

/**
 * Helper function to build module hierarchy
 */
export function buildModuleHierarchy(modules: Module[]): Module[] {
  const moduleMap = new Map<number, Module>();
  const rootModules: Module[] = [];

  // Create map and initialize children arrays
  modules.forEach(module => {
    moduleMap.set(module.moduleId, { ...module, children: [] });
  });

  // Build hierarchy
  modules.forEach(module => {
    const moduleWithChildren = moduleMap.get(module.moduleId)!;
    
    if (module.parentId && moduleMap.has(module.parentId)) {
      const parent = moduleMap.get(module.parentId)!;
      parent.children!.push(moduleWithChildren);
    } else {
      rootModules.push(moduleWithChildren);
    }
  });

  // Sort by sortOrder
  const sortModules = (modules: Module[]) => {
    modules.sort((a, b) => a.sortOrder - b.sortOrder);
    modules.forEach(module => {
      if (module.children && module.children.length > 0) {
        sortModules(module.children);
      }
    });
  };

  sortModules(rootModules);
  return rootModules;
}

/**
 * Helper function to convert module code to route path
 */
export function moduleCodeToPath(code: string): string {
  return '/' + code.toLowerCase().replace(/\./g, '/');
}