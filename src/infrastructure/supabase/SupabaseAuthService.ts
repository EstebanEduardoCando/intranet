import { AuthService, AuthResult, LoginCredentials } from '../../domain/auth/AuthService';
import { User, CreateUserData } from '../../domain/user/User';
import { 
  AuthenticationError, 
  RegistrationError, 
  EmailAlreadyInUseError,
  UnauthorizedError 
} from '../../domain/auth/AuthErrors';
import { supabase } from './supabaseClient';
import { SupabasePersonRepository } from './SupabasePersonRepository';
import { SupabaseUserProfileRepository } from './SupabaseUserProfileRepository';
import { getPersonDisplayName } from '../../domain/user/Person';

/**
 * Supabase implementation of AuthService
 * This is an adapter in the hexagonal architecture
 */
export class SupabaseAuthService implements AuthService {
  private personRepository = new SupabasePersonRepository();
  private userProfileRepository = new SupabaseUserProfileRepository();
  
  /**
   * Convert Supabase auth user to domain User entity
   * Combines auth.users data with user_profiles and persons data
   */
  private async mapAuthUserToUser(authUser: any): Promise<User> {
    // Get user profile
    const userProfile = await this.userProfileRepository.findByUserId(authUser.id);
    
    if (!userProfile) {
      throw new Error('User profile not found. User may need to complete registration.');
    }
    
    // Get person data
    const person = await this.personRepository.findById(userProfile.personId);
    
    if (!person) {
      throw new Error('Person data not found for user profile.');
    }
    
    return {
      id: authUser.id,
      email: authUser.email,
      emailVerified: authUser.email_confirmed_at !== null,
      profile: userProfile,
      person: person
    };
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
    
    // Update last login timestamp
    await this.userProfileRepository.updateLastLogin(user.id);
    
    return {
      user,
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      expiresAt: new Date(data.session.expires_at! * 1000)
    };
  }
  
  async register(userData: CreateUserData): Promise<AuthResult> {
    console.log('Attempting to register user:', { email: userData.email });
    
    try {
      // Start a transaction-like approach (Supabase doesn't have real transactions for auth + custom tables)
      
      // 1. First create the auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            firstName: userData.person.firstName,
            lastName: userData.person.lastName
          },
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      });
      
      console.log('Supabase auth registration response:', { authData, authError });
      
      if (authError) {
        console.error('Auth registration error:', authError);
        if (authError.message.includes('already registered') || authError.message.includes('already been registered')) {
          throw new EmailAlreadyInUseError(authError.message, authError);
        }
        throw new RegistrationError(authError.message, authError);
      }
      
      if (!authData.user) {
        throw new RegistrationError('Registration failed - no user returned');
      }
      
      // Handle case where email confirmation is required
      if (!authData.session) {
        console.log('User created but session not available - email confirmation may be required');
        throw new RegistrationError(
          'Cuenta creada exitosamente. Por favor verifica tu email antes de iniciar sesión.'
        );
      }
      
      // 2. Create person record
      const person = await this.personRepository.create({
        firstName: userData.person.firstName,
        middleName: userData.person.middleName,
        lastName: userData.person.lastName,
        secondLastName: userData.person.secondLastName,
        identityType: userData.person.identityType,
        identityNumber: userData.person.identityNumber,
        email: userData.email, // Use the same email as auth
        phone: userData.person.phone,
        birthDate: userData.person.birthDate
      });
      
      // 3. Create user profile
      const userProfile = await this.userProfileRepository.create({
        userId: authData.user.id,
        personId: person.personId,
        username: userData.username,
        isActive: true,
        preferences: {}
      });
      
      // 4. Build complete user object
      const user: User = {
        id: authData.user.id,
        email: authData.user.email!,
        emailVerified: authData.user.email_confirmed_at !== null,
        profile: userProfile,
        person: person
      };
      
      return {
        user,
        accessToken: authData.session.access_token,
        refreshToken: authData.session.refresh_token,
        expiresAt: new Date(authData.session.expires_at! * 1000)
      };
      
    } catch (error) {
      // If any step fails after auth user creation, we should ideally clean up
      // but Supabase doesn't provide easy rollback for auth users
      console.error('Registration process failed:', error);
      throw error;
    }
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