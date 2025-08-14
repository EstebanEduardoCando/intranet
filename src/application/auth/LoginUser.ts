import { AuthService, LoginCredentials, AuthResult } from '../../domain/auth/AuthService';

/**
 * Use case for user login
 * This is part of the application layer in hexagonal architecture
 */
export class LoginUser {
  constructor(private authService: AuthService) {}
  
  /**
   * Execute user login
   * @param credentials User login credentials
   * @returns Promise resolving to authentication result
   * @throws AuthenticationError if login fails
   */
  async execute(credentials: LoginCredentials): Promise<AuthResult> {
    // Validate input
    if (!credentials.email || !credentials.password) {
      throw new Error('Email and password are required');
    }
    
    if (!this.isValidEmail(credentials.email)) {
      throw new Error('Invalid email format');
    }
    
    // Delegate to auth service
    return await this.authService.login(credentials);
  }
  
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}