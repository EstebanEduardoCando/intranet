import { User } from '../../domain/user/User';
import { UserRepository } from '../../domain/user/UserRepository';
import { PositionRepository } from '../../domain/position/PositionRepository';
import { supabase } from '../../infrastructure/supabase/supabaseClient';

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

      // Get person_id from user profile
      const personId = user.profile.personId;

      // Check if user has an active assignment
      const { data: existingAssignments } = await supabase
        .from('position_assignments')
        .select('*')
        .eq('person_id', personId)
        .eq('status', 'ACTIVE');

      if (existingAssignments && existingAssignments.length > 0) {
        // Update existing assignment with new position
        const assignment = existingAssignments[0];
        
        const { error: updateError } = await supabase
          .from('position_assignments')
          .update({ 
            position_id: positionId,
            updated_at: new Date().toISOString()
          })
          .eq('assignment_id', assignment.assignment_id);

        if (updateError) {
          throw new Error(`Failed to update position assignment: ${updateError.message}`);
        }
      } else {
        // Create new assignment (requires a company - use a default one)
        const { data: defaultCompany } = await supabase
          .from('companies')
          .select('company_id')
          .eq('legal_name', 'General')
          .single();

        if (!defaultCompany) {
          throw new Error('No default company available. Please assign a company first.');
        }

        const { error: insertError } = await supabase
          .from('position_assignments')
          .insert({
            person_id: personId,
            company_id: defaultCompany.company_id,
            position_id: positionId,
            is_primary: true,
            start_date: new Date().toISOString().split('T')[0],
            status: 'ACTIVE'
          });

        if (insertError) {
          throw new Error(`Failed to create position assignment: ${insertError.message}`);
        }
      }

      // Return updated user
      const updatedUser = await this.userRepository.findById(userId);
      if (!updatedUser) {
        throw new Error('Failed to retrieve updated user');
      }

      return updatedUser;
    } catch (error) {
      throw new Error(`Error assigning position to user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}