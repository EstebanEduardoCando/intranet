import { AuthService, RegisterData, AuthResult } from '../../domain/auth/AuthService';
import { CreateUserData } from '../../domain/user/User';

/**
 * Use case for user registration
 * This is part of the application layer in hexagonal architecture
 */
export class RegisterUser {
  constructor(private authService: AuthService) {}
  
  /**
   * Execute user registration with complete profile data
   * @param userData Complete user creation data
   * @returns Promise resolving to authentication result
   * @throws RegistrationError if registration fails
   */
  async execute(userData: CreateUserData): Promise<AuthResult> {
    // Validate input
    this.validateUserData(userData);
    
    // Delegate to auth service
    return await this.authService.register(userData);
  }
  
  /**
   * Execute user registration (legacy method for backward compatibility)
   * @param data User registration data
   * @returns Promise resolving to authentication result
   * @throws RegistrationError if registration fails
   * @deprecated Use execute(CreateUserData) instead
   */
  async executeLegacy(data: RegisterData): Promise<AuthResult> {
    // Convert legacy format to new format
    const userData: CreateUserData = {
      email: data.email,
      password: data.password,
      person: {
        firstName: data.name.split(' ')[0] || data.name,
        lastName: data.name.split(' ').slice(1).join(' ') || 'N/A',
        identityType: 'OTHER',
        identityNumber: `TEMP_${Date.now()}` // Temporary ID, should be updated later
      }
    };
    
    return this.execute(userData);
  }
  
  private validateUserData(userData: CreateUserData): void {
    // Validate email and password
    if (!userData.email || !userData.password) {
      throw new Error('Email and password are required');
    }
    
    if (!this.isValidEmail(userData.email)) {
      throw new Error('Invalid email format');
    }
    
    if (userData.password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }
    
    // Validate person data
    if (!userData.person.firstName || !userData.person.lastName) {
      throw new Error('First name and last name are required');
    }
    
    if (userData.person.firstName.trim().length < 2) {
      throw new Error('First name must be at least 2 characters long');
    }
    
    if (userData.person.lastName.trim().length < 2) {
      throw new Error('Last name must be at least 2 characters long');
    }
    
    if (!userData.person.identityType || !userData.person.identityNumber) {
      throw new Error('Identity type and number are required');
    }
    
    if (userData.person.identityNumber.trim().length < 3) {
      throw new Error('Identity number must be at least 3 characters long');
    }
    
    // Validate username if provided
    if (userData.username && userData.username.trim().length < 3) {
      throw new Error('Username must be at least 3 characters long');
    }
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