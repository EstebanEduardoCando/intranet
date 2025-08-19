/**
 * Company entity representing an organization
 */
export interface Company {
  /** Unique company identifier */
  companyId: number;
  
  /** Company name */
  name: string;
  
  /** Company description */
  description?: string;
  
  /** Whether the company is active */
  isActive: boolean;
  
  /** Company address */
  address?: string;
  
  /** Company phone */
  phone?: string;
  
  /** Company email */
  email?: string;
  
  /** Company website */
  website?: string;
  
  /** Whether the company is deleted (soft delete) */
  isDeleted: boolean;
  
  /** Version for optimistic locking */
  version?: number;
  
  /** User who created the company */
  createdBy?: string;
  
  /** User who last updated the company */
  updatedBy?: string;
  
  /** Timestamp when the company was created */
  createdAt: Date;
  
  /** Timestamp when the company was last updated */
  updatedAt: Date;
}

/**
 * Company creation data
 */
export interface CreateCompanyData {
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
}

/**
 * Company update data
 */
export interface UpdateCompanyData {
  name?: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  isActive?: boolean;
  isDeleted?: boolean;
}