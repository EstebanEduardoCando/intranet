/**
 * User entity representing a user in the system
 */
export interface User {
  /** Unique identifier for the user */
  id: string;
  
  /** User's email address (unique) */
  email: string;
  
  /** User's full name */
  name: string;
  
  /** User's avatar URL (optional) */
  avatarUrl?: string;
  
  /** Timestamp when the user was created */
  createdAt: Date;
  
  /** Timestamp when the user was last updated */
  updatedAt: Date;
  
  /** Whether the user's email is verified */
  emailVerified: boolean;
}