import { User, CreateUserData } from '../user/User';

/**
 * Authentication result for login operations
 */
export interface AuthResult {
  /** The authenticated user */
  user: User;
  
  /** Access token for API requests */
  accessToken: string;
  
  /** Refresh token for renewing access */
  refreshToken?: string;
  
  /** Token expiration timestamp */
  expiresAt: Date;
}

/**
 * Login credentials
 */
export interface LoginCredentials {
  /** User's email address */
  email: string;
  
  /** User's password */
  password: string;
}

/**
 * Registration data (legacy interface for backward compatibility)
 * @deprecated Use CreateUserData instead
 */
export interface RegisterData {
  /** User's email address */
  email: string;
  
  /** User's password */
  password: string;
  
  /** User's full name */
  name: string;
}

/**
 * Authentication service interface
 * This is a port in the hexagonal architecture
 */
export interface AuthService {
  /**
   * Authenticate user with email and password
   * @param credentials Login credentials
   * @returns Promise resolving to authentication result
   * @throws AuthenticationError if credentials are invalid
   */
  login(credentials: LoginCredentials): Promise<AuthResult>;
  
  /**
   * Register a new user with complete profile data
   * @param userData Complete user creation data
   * @returns Promise resolving to authentication result
   * @throws RegistrationError if registration fails
   */
  register(userData: CreateUserData): Promise<AuthResult>;
  
  /**
   * Register a new user (legacy method for backward compatibility)
   * @param data Registration data
   * @returns Promise resolving to authentication result
   * @throws RegistrationError if registration fails
   * @deprecated Use register(CreateUserData) instead
   */
  registerLegacy?(data: RegisterData): Promise<AuthResult>;
  
  /**
   * Sign out the current user
   * @returns Promise resolving when logout is complete
   */
  logout(): Promise<void>;
  
  /**
   * Get current authenticated user
   * @returns Promise resolving to current user or null if not authenticated
   */
  getCurrentUser(): Promise<User | null>;
  
  /**
   * Refresh access token
   * @param refreshToken Refresh token
   * @returns Promise resolving to new authentication result
   */
  refreshToken(refreshToken: string): Promise<AuthResult>;
  
  /**
   * Send password reset email
   * @param email User's email address
   * @returns Promise resolving when email is sent
   */
  resetPassword(email: string): Promise<void>;
}