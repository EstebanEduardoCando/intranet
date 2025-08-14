import { AuthService } from '../../domain/auth/AuthService';
import { User } from '../../domain/user/User';

/**
 * Use case for getting current authenticated user
 * This is part of the application layer in hexagonal architecture
 */
export class GetCurrentUser {
  constructor(private authService: AuthService) {}
  
  /**
   * Execute get current user
   * @returns Promise resolving to current user or null if not authenticated
   */
  async execute(): Promise<User | null> {
    return await this.authService.getCurrentUser();
  }
}