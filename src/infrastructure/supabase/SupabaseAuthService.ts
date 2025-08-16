import { AuthService, AuthResult, LoginCredentials, RegisterData } from '../../domain/auth/AuthService';
import { User } from '../../domain/user/User';
import { 
  AuthenticationError, 
  RegistrationError, 
  EmailAlreadyInUseError,
  UnauthorizedError 
} from '../../domain/auth/AuthErrors';
import { supabase } from './supabaseClient';
import { SupabaseUserRepository } from './SupabaseUserRepository';

/**
 * Supabase implementation of AuthService
 * This is an adapter in the hexagonal architecture
 */
export class SupabaseAuthService implements AuthService {
  private userRepository = new SupabaseUserRepository();
  
  /**
   * Convert Supabase user to domain User entity
   */
  private async mapAuthUserToUser(authUser: any): Promise<User> {
    // Try to get user from our users table first
    let user = await this.userRepository.findById(authUser.id);
    
    if (!user) {
      // Create user profile if it doesn't exist
      user = await this.userRepository.save({
        id: authUser.id,
        email: authUser.email,
        name: authUser.user_metadata?.name || authUser.email.split('@')[0],
        avatarUrl: authUser.user_metadata?.avatar_url,
        createdAt: new Date(authUser.created_at),
        updatedAt: new Date(),
        emailVerified: authUser.email_confirmed_at !== null
      });
    }
    
    return user;
  }
  
  async login(credentials: LoginCredentials): Promise<AuthResult> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password
    });
    
    if (error) {
      throw new AuthenticationError(error.message, error);
    }
    
    if (!data.user || !data.session) {
      throw new AuthenticationError('Authentication failed');
    }
    
    const user = await this.mapAuthUserToUser(data.user);
    
    return {
      user,
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      expiresAt: new Date(data.session.expires_at! * 1000)
    };
  }
  
  async register(registerData: RegisterData): Promise<AuthResult> {
    console.log('Attempting to register user:', { email: registerData.email, name: registerData.name });
    
    const { data, error } = await supabase.auth.signUp({
      email: registerData.email,
      password: registerData.password,
      options: {
        data: {
          name: registerData.name
        },
        emailRedirectTo: `${window.location.origin}/dashboard`
      }
    });
    
    console.log('Supabase registration response:', { data, error });
    
    if (error) {
      console.error('Registration error:', error);
      if (error.message.includes('already registered') || error.message.includes('already been registered')) {
        throw new EmailAlreadyInUseError(error.message, error);
      }
      throw new RegistrationError(error.message, error);
    }
    
    if (!data.user) {
      throw new RegistrationError('Registration failed - no user returned');
    }
    
    // Handle case where email confirmation is required
    if (!data.session) {
      console.log('User created but session not available - email confirmation may be required');
      
      // If email confirmation is enabled, we still want to return the user info
      // but the user won't be automatically logged in
      const user: User = {
        id: data.user.id,
        email: data.user.email!,
        name: registerData.name,
        avatarUrl: undefined,
        createdAt: new Date(data.user.created_at),
        updatedAt: new Date(),
        emailVerified: false
      };
      
      // For now, throw an informative error
      throw new RegistrationError(
        'Cuenta creada exitosamente. Por favor verifica tu email antes de iniciar sesión.'
      );
    }
    
    const user = await this.mapAuthUserToUser(data.user);
    
    return {
      user,
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      expiresAt: new Date(data.session.expires_at! * 1000)
    };
  }
  
  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      throw new Error(`Logout failed: ${error.message}`);
    }
  }
  
  async getCurrentUser(): Promise<User | null> {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      throw new UnauthorizedError(error.message, error);
    }
    
    if (!user) {
      return null;
    }
    
    return await this.mapAuthUserToUser(user);
  }
  
  async refreshToken(refreshToken: string): Promise<AuthResult> {
    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: refreshToken
    });
    
    if (error) {
      throw new AuthenticationError(`Token refresh failed: ${error.message}`, error);
    }
    
    if (!data.user || !data.session) {
      throw new AuthenticationError('Token refresh failed');
    }
    
    const user = await this.mapAuthUserToUser(data.user);
    
    return {
      user,
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      expiresAt: new Date(data.session.expires_at! * 1000)
    };
  }
  
  async resetPassword(email: string): Promise<void> {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });
    
    if (error) {
      throw new Error(`Password reset failed: ${error.message}`);
    }
  }
  
  async updatePassword(newPassword: string): Promise<void> {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });
    
    if (error) {
      throw new Error(`Password update failed: ${error.message}`);
    }
  }
}