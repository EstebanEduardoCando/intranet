import { UpdateUserData, User } from '../../domain/user/User';
import { SupabasePersonRepository } from '../../infrastructure/supabase/SupabasePersonRepository';
import { SupabaseUserProfileRepository } from '../../infrastructure/supabase/SupabaseUserProfileRepository';

/**
 * Use case for updating user profile
 * This is part of the application layer in hexagonal architecture
 */
export class UpdateUserProfile {
  constructor(
    private personRepository: SupabasePersonRepository,
    private userProfileRepository: SupabaseUserProfileRepository
  ) {}

  /**
   * Execute user profile update
   * @param userId User ID (UUID from Supabase auth)
   * @param updateData Data to update
   * @returns Promise resolving to updated user data
   */
  async execute(userId: string, updateData: UpdateUserData): Promise<{ success: boolean; message: string }> {
    try {
      // Get current user profile to get person_id
      const currentProfile = await this.userProfileRepository.findByUserId(userId);
      if (!currentProfile) {
        throw new Error('User profile not found');
      }

      // Update person data if provided
      if (updateData.person) {
        const updatedPerson = await this.personRepository.update(
          currentProfile.personId,
          updateData.person
        );
        
        if (!updatedPerson) {
          throw new Error('Failed to update person data');
        }
      }

      // Update profile data if provided
      if (updateData.profile) {
        const updatedProfile = await this.userProfileRepository.update(
          userId,
          updateData.profile
        );
        
        if (!updatedProfile) {
          throw new Error('Failed to update profile data');
        }
      }

      return {
        success: true,
        message: 'Perfil actualizado exitosamente'
      };

    } catch (error) {
      console.error('Error updating user profile:', error);
      throw new Error(
        error instanceof Error 
          ? error.message 
          : 'Error al actualizar el perfil'
      );
    }
  }

  /**
   * Validate update data
   */
  private validateUpdateData(updateData: UpdateUserData): void {
    if (updateData.person) {
      if (updateData.person.firstName && updateData.person.firstName.trim().length < 2) {
        throw new Error('El primer nombre debe tener al menos 2 caracteres');
      }
      
      if (updateData.person.lastName && updateData.person.lastName.trim().length < 2) {
        throw new Error('El primer apellido debe tener al menos 2 caracteres');
      }
      
      if (updateData.person.phone && updateData.person.phone.trim().length > 0 && updateData.person.phone.trim().length < 10) {
        throw new Error('El teléfono debe tener al menos 10 caracteres');
      }
    }
    
    if (updateData.profile) {
      if (updateData.profile.username && updateData.profile.username.trim().length > 0 && updateData.profile.username.trim().length < 3) {
        throw new Error('El nombre de usuario debe tener al menos 3 caracteres');
      }
    }
  }
}