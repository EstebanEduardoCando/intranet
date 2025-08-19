import { User } from './User';

/**
 * Repository interface for user operations
 * This is a port in the hexagonal architecture
 */
export interface UserRepository {
  /**
   * Find user by ID
   * @param id User ID to search for
   * @returns Promise resolving to User or null if not found
   */
  findById(id: string): Promise<User | null>;
  
  /**
   * Find user by email
   * @param email Email address to search for
   * @returns Promise resolving to User or null if not found
   */
  findByEmail(email: string): Promise<User | null>;
  
  /**
   * Save user (create or update)
   * @param user User data to save
   * @returns Promise resolving to the saved User
   */
  save(user: User): Promise<User>;
  
  /**
   * Update user data
   * @param id User ID to update
   * @param data Partial user data to update
   * @returns Promise resolving to the updated User or null if not found
   */
  update(id: string, data: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User | null>;
  
  /**
   * Delete user by ID
   * @param id User ID to delete
   * @returns Promise resolving to boolean indicating success
   */
  delete(id: string): Promise<boolean>;
  
  /**
   * Find all users with pagination
   * @param page Page number (0-based)
   * @param limit Number of users per page
   * @returns Promise resolving to array of Users
   */
  findAll(page?: number, limit?: number): Promise<User[]>;
  
  /**
   * Search users by term
   * @param searchTerm Search term to look for in name, email, identity
   * @param page Page number (0-based)
   * @param limit Number of users per page
   * @returns Promise resolving to array of Users
   */
  search(searchTerm: string, page?: number, limit?: number): Promise<User[]>;
  
  /**
   * Count total users
   * @returns Promise resolving to total count
   */
  count(): Promise<number>;
}