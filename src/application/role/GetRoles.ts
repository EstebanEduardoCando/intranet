import { Role } from '../../domain/role/Role';
import { RoleRepository } from '../../domain/role/RoleRepository';

export class GetRoles {
  constructor(private roleRepository: RoleRepository) {}

  async execute(): Promise<Role[]> {
    try {
      return await this.roleRepository.findAll();
    } catch (error) {
      throw new Error(`Error fetching roles: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}