import { supabase } from './supabaseClient';
import { UserProfile } from '../../domain/user/User';

/**
 * Database row structure for user_profiles table
 */
interface UserProfileRow {
  profile_id: number;
  user_id: string;
  person_id: number;
  username: string | null;
  is_active: boolean;
  last_login_at: string | null;
  preferences: any;
  created_at: string;
  updated_at: string;
}

/**
 * Supabase implementation for UserProfile repository
 */
export class SupabaseUserProfileRepository {
  
  /**
   * Convert database row to domain UserProfile entity
   */
  private mapRowToUserProfile(row: UserProfileRow): UserProfile {
    return {
      profileId: row.profile_id,
      userId: row.user_id,
      personId: row.person_id,
      username: row.username || undefined,
      isActive: row.is_active,
      lastLoginAt: row.last_login_at ? new Date(row.last_login_at) : undefined,
      preferences: row.preferences || {},
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    };
  }
  
  /**
   * Convert domain UserProfile entity to database row for insert/update
   */
  private mapUserProfileToRow(profile: Omit<UserProfile, 'profileId' | 'createdAt' | 'updatedAt'>): Omit<UserProfileRow, 'profile_id' | 'created_at' | 'updated_at'> {
    return {
      user_id: profile.userId,
      person_id: profile.personId,
      username: profile.username || null,
      is_active: profile.isActive,
      last_login_at: profile.lastLoginAt ? profile.lastLoginAt.toISOString() : null,
      preferences: profile.preferences
    };
  }
  
  async findByUserId(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return null; // No rows returned
      }
      throw new Error(`Failed to find user profile by user ID: ${error.message}`);
    }
    
    return this.mapRowToUserProfile(data);
  }
  
  async findByPersonId(personId: number): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('person_id', personId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return null; // No rows returned
      }
      throw new Error(`Failed to find user profile by person ID: ${error.message}`);
    }
    
    return this.mapRowToUserProfile(data);
  }
  
  async findByUsername(username: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('username', username)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return null; // No rows returned
      }
      throw new Error(`Failed to find user profile by username: ${error.message}`);
    }
    
    return this.mapRowToUserProfile(data);
  }
  
  async create(profileData: Omit<UserProfile, 'profileId' | 'createdAt' | 'updatedAt'>): Promise<UserProfile> {
    const row = this.mapUserProfileToRow(profileData);
    
    const { data, error } = await supabase
      .from('user_profiles')
      .insert(row)
      .select()
      .single();
    
    if (error) {
      throw new Error(`Failed to create user profile: ${error.message}`);
    }
    
    return this.mapRowToUserProfile(data);
  }
  
  async update(userId: string, updateData: Partial<Omit<UserProfile, 'profileId' | 'userId' | 'createdAt' | 'updatedAt'>>): Promise<UserProfile | null> {
    const rowUpdateData: Partial<UserProfileRow> = {};
    
    if (updateData.personId !== undefined) rowUpdateData.person_id = updateData.personId;
    if (updateData.username !== undefined) rowUpdateData.username = updateData.username || null;
    if (updateData.isActive !== undefined) rowUpdateData.is_active = updateData.isActive;
    if (updateData.lastLoginAt !== undefined) {
      rowUpdateData.last_login_at = updateData.lastLoginAt ? updateData.lastLoginAt.toISOString() : null;
    }
    if (updateData.preferences !== undefined) rowUpdateData.preferences = updateData.preferences;
    
    const { data, error } = await supabase
      .from('user_profiles')
      .update(rowUpdateData)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return null; // No rows updated
      }
      throw new Error(`Failed to update user profile: ${error.message}`);
    }
    
    return this.mapRowToUserProfile(data);
  }
  
  async updateLastLogin(userId: string): Promise<void> {
    const { error } = await supabase
      .from('user_profiles')
      .update({ last_login_at: new Date().toISOString() })
      .eq('user_id', userId);
    
    if (error) {
      throw new Error(`Failed to update last login: ${error.message}`);
    }
  }
  
  async delete(userId: string): Promise<boolean> {
    const { error } = await supabase
      .from('user_profiles')
      .delete()
      .eq('user_id', userId);
    
    if (error) {
      throw new Error(`Failed to delete user profile: ${error.message}`);
    }
    
    return true;
  }
}