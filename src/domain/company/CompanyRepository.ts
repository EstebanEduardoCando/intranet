import { Company, CreateCompanyData, UpdateCompanyData } from './Company';

/**
 * Repository interface for company operations
 */
export interface CompanyRepository {
  /**
   * Find all active companies
   * @returns Promise resolving to array of companies
   */
  findAll(): Promise<Company[]>;
  
  /**
   * Find company by ID
   * @param id Company ID to search for
   * @returns Promise resolving to Company or null if not found
   */
  findById(id: number): Promise<Company | null>;
  
  /**
   * Create new company
   * @param data Company creation data
   * @returns Promise resolving to the created Company
   */
  create(data: CreateCompanyData): Promise<Company>;
  
  /**
   * Update company
   * @param id Company ID to update
   * @param data Company update data
   * @returns Promise resolving to updated Company or null if not found
   */
  update(id: number, data: UpdateCompanyData): Promise<Company | null>;
  
  /**
   * Delete company by ID
   * @param id Company ID to delete
   * @returns Promise resolving to boolean indicating success
   */
  delete(id: number): Promise<boolean>;
}