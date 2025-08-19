import { User } from '../../domain/user/User';
import { UserRepository } from '../../domain/user/UserRepository';
import { CompanyRepository } from '../../domain/company/CompanyRepository';
import { supabase } from '../../infrastructure/supabase/supabaseClient';

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

      // Get person_id from user profile
      const personId = user.profile.personId;

      // Check if user already has an active assignment for this company
      const { data: existingAssignment } = await supabase
        .from('position_assignments')
        .select('*')
        .eq('person_id', personId)
        .eq('company_id', companyId)
        .eq('status', 'ACTIVE')
        .single();

      if (existingAssignment) {
        // Update existing assignment
        const { error: updateError } = await supabase
          .from('position_assignments')
          .update({ 
            updated_at: new Date().toISOString()
          })
          .eq('assignment_id', existingAssignment.assignment_id);

        if (updateError) {
          throw new Error(`Failed to update company assignment: ${updateError.message}`);
        }
      } else {
        // Create new assignment (requires a position - use a default one)
        // First, get a default position or create a general one
        const { data: defaultPosition } = await supabase
          .from('positions')
          .select('position_id')
          .eq('name', 'General')
          .single();

        if (!defaultPosition) {
          throw new Error('No default position available. Please assign a position first.');
        }

        const { error: insertError } = await supabase
          .from('position_assignments')
          .insert({
            person_id: personId,
            company_id: companyId,
            position_id: defaultPosition.position_id,
            is_primary: true,
            start_date: new Date().toISOString().split('T')[0],
            status: 'ACTIVE'
          });

        if (insertError) {
          throw new Error(`Failed to create company assignment: ${insertError.message}`);
        }
      }

      // Return updated user
      const updatedUser = await this.userRepository.findById(userId);
      if (!updatedUser) {
        throw new Error('Failed to retrieve updated user');
      }

      return updatedUser;
    } catch (error) {
      throw new Error(`Error assigning company to user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}