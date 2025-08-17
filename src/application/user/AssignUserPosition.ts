import { User } from '../../domain/user/User';
import { UserRepository } from '../../domain/user/UserRepository';
import { PositionRepository } from '../../domain/position/PositionRepository';

export interface AssignUserPositionRequest {
  userId: string;
  positionId: number;
}

export class AssignUserPosition {
  constructor(
    private userRepository: UserRepository,
    private positionRepository: PositionRepository
  ) {}

  async execute(request: AssignUserPositionRequest): Promise<User> {
    const { userId, positionId } = request;

    if (!userId) {
      throw new Error('User ID is required');
    }

    if (!positionId) {
      throw new Error('Position ID is required');
    }

    try {
      // Check if user exists
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Check if position exists
      const position = await this.positionRepository.findById(positionId);
      if (!position) {
        throw new Error('Position not found');
      }

      // Update user with position assignment
      const updatedUser = await this.userRepository.update(userId, {
        profile: {
          ...user.profile,
          positionId
        }
      });

      if (!updatedUser) {
        throw new Error('Failed to assign position to user');
      }

      return updatedUser;
    } catch (error) {
      throw new Error(`Error assigning position to user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}