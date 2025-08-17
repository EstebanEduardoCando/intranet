import { Company } from '../../domain/company/Company';
import { CompanyRepository } from '../../domain/company/CompanyRepository';

export class GetCompanies {
  constructor(private companyRepository: CompanyRepository) {}

  async execute(): Promise<Company[]> {
    try {
      return await this.companyRepository.findAll();
    } catch (error) {
      throw new Error(`Error fetching companies: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}