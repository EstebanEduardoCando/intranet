import { AuthService } from '../../domain/auth/AuthService';

/**
 * Use case for user logout
 * This is part of the application layer in hexagonal architecture
 */
export class LogoutUser {
  constructor(private authService: AuthService) {}
  
  /**
   * Execute user logout
   * @returns Promise resolving when logout is complete
   */
  async execute(): Promise<void> {
    await this.authService.logout();
  }
}