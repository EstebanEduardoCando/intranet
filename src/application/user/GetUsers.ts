import { User } from '../../domain/user/User';
import { UserRepository } from '../../domain/user/UserRepository';

export interface GetUsersRequest {
  page?: number;
  limit?: number;
  searchTerm?: string;
}

export interface GetUsersResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
}

export class GetUsers {
  constructor(private userRepository: UserRepository) {}

  async execute(request: GetUsersRequest = {}): Promise<GetUsersResponse> {
    const { page = 0, limit = 10, searchTerm } = request;

    try {
      let users: User[];
      
      if (searchTerm && searchTerm.trim() !== '') {
        users = await this.userRepository.search(searchTerm, page, limit);
      } else {
        users = await this.userRepository.findAll(page, limit);
      }

      const total = await this.userRepository.count();

      return {
        users,
        total,
        page,
        limit
      };
    } catch (error) {
      throw new Error(`Error fetching users: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}