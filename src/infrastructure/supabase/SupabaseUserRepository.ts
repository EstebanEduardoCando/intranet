import { UserRepository } from '../../domain/user/UserRepository';
import { User } from '../../domain/user/User';
import { supabase } from './supabaseClient';

/**
 * Database row structure for users table
 */
interface UserRow {
  id: string;
  email: string;
  name: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  email_verified: boolean;
}

/**
 * Supabase implementation of UserRepository
 * This is an adapter in the hexagonal architecture
 */
export class SupabaseUserRepository implements UserRepository {
  
  /**
   * Convert database row to domain User entity
   */
  private mapRowToUser(row: UserRow): User {
    return {
      id: row.id,
      email: row.email,
      name: row.name,
      avatarUrl: row.avatar_url || undefined,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
      emailVerified: row.email_verified
    };
  }
  
  /**
   * Convert domain User entity to database row
   */
  private mapUserToRow(user: User): Omit<UserRow, 'created_at' | 'updated_at'> {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar_url: user.avatarUrl || null,
      email_verified: user.emailVerified
    };
  }
  
  async findById(id: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return null; // No rows returned
      }
      throw new Error(`Failed to find user by ID: ${error.message}`);
    }
    
    return this.mapRowToUser(data);
  }
  
  async findByEmail(email: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return null; // No rows returned
      }
      throw new Error(`Failed to find user by email: ${error.message}`);
    }
    
    return this.mapRowToUser(data);
  }
  
  async save(user: User): Promise<User> {
    const row = this.mapUserToRow(user);
    
    const { data, error } = await supabase
      .from('users')
      .upsert(row)
      .select()
      .single();
    
    if (error) {
      throw new Error(`Failed to save user: ${error.message}`);
    }
    
    return this.mapRowToUser(data);
  }
  
  async update(id: string, data: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User | null> {
    const updateData: Partial<UserRow> = {};
    
    if (data.email !== undefined) updateData.email = data.email;
    if (data.name !== undefined) updateData.name = data.name;
    if (data.avatarUrl !== undefined) updateData.avatar_url = data.avatarUrl || null;
    if (data.emailVerified !== undefined) updateData.email_verified = data.emailVerified;
    
    // Always update the updated_at timestamp
    updateData.updated_at = new Date().toISOString();
    
    const { data: result, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return null; // No rows updated
      }
      throw new Error(`Failed to update user: ${error.message}`);
    }
    
    return this.mapRowToUser(result);
  }
  
  async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw new Error(`Failed to delete user: ${error.message}`);
    }
    
    return true;
  }
}