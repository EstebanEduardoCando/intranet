import { CompanyRepository } from '../../domain/company/CompanyRepository';
import { Company, CreateCompanyData, UpdateCompanyData } from '../../domain/company/Company';
import { supabase } from './supabaseClient';

/**
 * Database row structure for companies table
 */
interface CompanyRow {
  company_id: number;
  name: string;
  description: string | null;
  is_active: boolean;
  address: string | null;
  phone: string | null;
  email: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Supabase implementation of CompanyRepository
 */
export class SupabaseCompanyRepository implements CompanyRepository {
  
  private mapRowToCompany(row: CompanyRow): Company {
    return {
      companyId: row.company_id,
      name: row.name,
      description: row.description || undefined,
      isActive: row.is_active,
      address: row.address || undefined,
      phone: row.phone || undefined,
      email: row.email || undefined,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    };
  }

  async findAll(): Promise<Company[]> {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) {
        throw new Error(`Failed to find companies: ${error.message}`);
      }

      return data.map(row => this.mapRowToCompany(row));
    } catch (error) {
      throw new Error(`Failed to find all companies: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async findById(id: number): Promise<Company | null> {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('company_id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw new Error(`Failed to find company: ${error.message}`);
      }

      return this.mapRowToCompany(data);
    } catch (error) {
      throw new Error(`Failed to find company by ID: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async create(data: CreateCompanyData): Promise<Company> {
    try {
      const { data: result, error } = await supabase
        .from('companies')
        .insert({
          name: data.name,
          description: data.description || null,
          address: data.address || null,
          phone: data.phone || null,
          email: data.email || null,
          is_active: true
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to create company: ${error.message}`);
      }

      return this.mapRowToCompany(result);
    } catch (error) {
      throw new Error(`Failed to create company: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async update(id: number, data: UpdateCompanyData): Promise<Company | null> {
    try {
      const updateData: Partial<CompanyRow> = {
        updated_at: new Date().toISOString()
      };

      if (data.name !== undefined) updateData.name = data.name;
      if (data.description !== undefined) updateData.description = data.description || null;
      if (data.address !== undefined) updateData.address = data.address || null;
      if (data.phone !== undefined) updateData.phone = data.phone || null;
      if (data.email !== undefined) updateData.email = data.email || null;
      if (data.isActive !== undefined) updateData.is_active = data.isActive;

      const { data: result, error } = await supabase
        .from('companies')
        .update(updateData)
        .eq('company_id', id)
        .select()
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw new Error(`Failed to update company: ${error.message}`);
      }

      return this.mapRowToCompany(result);
    } catch (error) {
      throw new Error(`Failed to update company: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      // Soft delete by setting is_active to false
      const { error } = await supabase
        .from('companies')
        .update({ 
          is_active: false,
          updated_at: new Date().toISOString()
        })
        .eq('company_id', id);

      if (error) {
        throw new Error(`Failed to delete company: ${error.message}`);
      }

      return true;
    } catch (error) {
      throw new Error(`Failed to delete company: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}