import { SupabaseAuthService } from '../../infrastructure/supabase/SupabaseAuthService';

/**
 * Use case for changing user password
 * This is part of the application layer in hexagonal architecture
 */
export class ChangePassword {
  constructor(private authService: SupabaseAuthService) {}

  /**
   * Execute password change
   * @param currentPassword Current user password for verification
   * @param newPassword New password to set
   * @returns Promise resolving to success message
   */
  async execute(currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    try {
      // Validate input
      this.validatePasswordData(currentPassword, newPassword);
      
      // TODO: Implement current password verification - ChangePassword.ts:20 - Prioridad: Alta
      // Supabase doesn't provide direct current password verification
      // We might need to attempt a sign-in to verify current password
      
      // Update password using Supabase
      await this.authService.updatePassword(newPassword);
      
      return {
        success: true,
        message: 'Contraseña actualizada exitosamente'
      };

    } catch (error) {
      throw new Error(
        error instanceof Error 
          ? error.message 
          : 'Error al cambiar la contraseña'
      );
    }
  }

  /**
   * Validate password change data
   */
  private validatePasswordData(currentPassword: string, newPassword: string): void {
    if (!currentPassword || !newPassword) {
      throw new Error('La contraseña actual y nueva son requeridas');
    }

    if (newPassword.length < 8) {
      throw new Error('La nueva contraseña debe tener al menos 8 caracteres');
    }

    if (currentPassword === newPassword) {
      throw new Error('La nueva contraseña debe ser diferente a la actual');
    }

    // Additional password strength validation
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
      throw new Error('La contraseña debe contener al menos: 1 mayúscula, 1 minúscula y 1 número');
    }
  }
}