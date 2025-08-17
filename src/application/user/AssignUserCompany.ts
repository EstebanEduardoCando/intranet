import { User } from '../../domain/user/User';
import { UserRepository } from '../../domain/user/UserRepository';
import { CompanyRepository } from '../../domain/company/CompanyRepository';

export interface AssignUserCompanyRequest {
  userId: string;
  companyId: number;
}

export class AssignUserCompany {
  constructor(
    private userRepository: UserRepository,
    private companyRepository: CompanyRepository
  ) {}

  async execute(request: AssignUserCompanyRequest): Promise<User> {
    const { userId, companyId } = request;

    if (!userId) {
      throw new Error('User ID is required');
    }

    if (!companyId) {
      throw new Error('Company ID is required');
    }

    try {
      // Check if user exists
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Check if company exists
      const company = await this.companyRepository.findById(companyId);
      if (!company) {
        throw new Error('Company not found');
      }

      // Update user with company assignment
      const updatedUser = await this.userRepository.update(userId, {
        profile: {
          ...user.profile,
          companyId
        }
      });

      if (!updatedUser) {
        throw new Error('Failed to assign company to user');
      }

      return updatedUser;
    } catch (error) {
      throw new Error(`Error assigning company to user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}