/**
 * Module entity representing system modules and submodules
 */
export interface Module {
  /** Unique identifier for the module */
  moduleId: string;
  
  /** Parent module ID for hierarchical structure (null = main module) */
  parentId?: string;
  
  /** Unique code for the module (e.g., "ADMIN", "HR.EMPLOYEES") */
  code: string;
  
  /** Display name of the module */
  name: string;
  
  /** Description of the module */
  description?: string;
  
  /** Icon name/class for the module */
  icon?: string;
  
  /** Route path for navigation */
  route?: string;
  
  /** Sort order for display */
  order: number;
  
  /** Sort order (alias) */
  sortOrder: number;
  
  /** Whether the module is visible */
  isVisible: boolean;
  
  /** Whether the module is active */
  isActive: boolean;
  
  /** Required role to access this module */
  requiredRole?: string;
  
  /** Version for optimistic locking */
  version?: number;
  
  /** User who created the module */
  createdBy?: string;
  
  /** User who last updated the module */
  updatedBy?: string;
  
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
  const moduleMap = new Map<string, Module>();
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