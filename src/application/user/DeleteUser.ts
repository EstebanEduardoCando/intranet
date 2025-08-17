import { UserRepository } from '../../domain/user/UserRepository';

export interface DeleteUserRequest {
  userId: string;
}

export class DeleteUser {
  constructor(private userRepository: UserRepository) {}

  async execute(request: DeleteUserRequest): Promise<boolean> {
    const { userId } = request;

    if (!userId) {
      throw new Error('User ID is required');
    }

    try {
      // Check if user exists
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Delete the user
      const success = await this.userRepository.delete(userId);
      
      if (!success) {
        throw new Error('Failed to delete user');
      }

      return true;
    } catch (error) {
      throw new Error(`Error deleting user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}