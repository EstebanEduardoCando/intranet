import { AuthService, RegisterData, AuthResult } from '../../domain/auth/AuthService';

/**
 * Use case for user registration
 * This is part of the application layer in hexagonal architecture
 */
export class RegisterUser {
  constructor(private authService: AuthService) {}
  
  /**
   * Execute user registration
   * @param data User registration data
   * @returns Promise resolving to authentication result
   * @throws RegistrationError if registration fails
   */
  async execute(data: RegisterData): Promise<AuthResult> {
    // Validate input
    this.validateRegistrationData(data);
    
    // Delegate to auth service
    return await this.authService.register(data);
  }
  
  private validateRegistrationData(data: RegisterData): void {
    if (!data.email || !data.password || !data.name) {
      throw new Error('Email, password, and name are required');
    }
    
    if (!this.isValidEmail(data.email)) {
      throw new Error('Invalid email format');
    }
    
    if (data.password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }
    
    if (data.name.trim().length < 2) {
      throw new Error('Name must be at least 2 characters long');
    }
  }
  
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}