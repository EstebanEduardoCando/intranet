import { Person } from './Person';
import { Company } from '../company/Company';
import { Position } from '../position/Position';
import { Role } from '../role/Role';

/**
 * UserProfile entity representing a user's system profile
 * Extends Supabase auth.users with business-specific information
 */
export interface UserProfile {
  /** Unique profile identifier */
  profileId: number;
  
  /** Reference to Supabase auth.users UUID */
  userId: string;
  
  /** Reference to person entity */
  personId: number;
  
  /** System username (optional, unique) */
  username?: string;
  
  /** Whether the user profile is active */
  isActive: boolean;
  
  /** Last login timestamp */
  lastLoginAt?: Date;
  
  /** User preferences and settings */
  preferences: Record<string, unknown>;
  
  /** Company ID (optional) */
  companyId?: number;
  
  /** Position ID (optional) */
  positionId?: number;
  
  /** Timestamp when the profile was created */
  createdAt: Date;
  
  /** Timestamp when the profile was last updated */
  updatedAt: Date;
}

/**
 * Complete User entity combining Supabase auth + profile + person data
 * This is what the application layer works with
 */
export interface User {
  /** Supabase auth user ID (UUID) */
  id: string;
  
  /** User's email from Supabase auth */
  email: string;
  
  /** Whether email is verified (from Supabase auth) */
  emailVerified: boolean;
  
  /** User profile information */
  profile: UserProfile;
  
  /** Person information */
  person: Person;
  
  /** Company information (optional) */
  company?: Company;
  
  /** Position information (optional) */
  position?: Position;
  
  /** User roles */
  roles: Role[];
}

/**
 * User creation data for registration
 */
export interface CreateUserData {
  email: string;
  password: string;
  person: {
    firstName: string;
    middleName?: string;
    lastName: string;
    secondLastName?: string;
    identityType: 'DNI' | 'PASSPORT' | 'CC' | 'NIE' | 'OTHER';
    identityNumber: string;
    phone?: string;
    birthDate?: Date;
  };
  username?: string;
}

/**
 * User update data for profile modifications
 */
export interface UpdateUserData {
  person?: Partial<{
    firstName: string;
    middleName: string;
    lastName: string;
    secondLastName: string;
    phone: string;
    birthDate: Date;
  }>;
  profile?: Partial<{
    username: string;
    preferences: Record<string, unknown>;
    companyId: number;
    positionId: number;
  }>;
}