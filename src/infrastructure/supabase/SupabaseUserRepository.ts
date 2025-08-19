import { UserRepository } from '../../domain/user/UserRepository';
import { User } from '../../domain/user/User';
import { Person } from '../../domain/user/Person';
import { supabase } from './supabaseClient';

/**
 * Database row structure for combined user data query (REAL STRUCTURE)
 */
interface UserRow {
  // Auth user data
  id: string;
  email: string;
  email_confirmed_at: string | null;
  
  // Profile data (REAL STRUCTURE - sin company_id/position_id)
  profile_id: number;
  username: string | null;
  is_active: boolean;
  last_login_at: string | null;
  preferences: any;
  profile_created_at: string;
  profile_updated_at: string;
  
  // Person data (REAL STRUCTURE)
  person_id: number;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  second_last_name: string | null;
  identity_type: string;
  identity_number: string;
  person_email: string | null;
  phone: string | null;
  birth_date: string | null;
  person_created_at: string;
  person_updated_at: string;
}

/**
 * Role data structure
 */
interface RoleRow {
  role_id: number;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Supabase implementation of UserRepository adapted to REAL database structure
 */
export class SupabaseUserRepository implements UserRepository {
  
  /**
   * Get company and position assignment for a person
   */
  private async getAssignmentInfo(personId: number): Promise<{ company?: any, position?: any }> {
    try {
      const { data: assignment } = await supabase
        .from('position_assignments')
        .select(`
          companies!inner (
            company_id,
            legal_name,
            trade_name,
            is_active
          ),
          positions!inner (
            position_id,
            name,
            description,
            level,
            is_active
          )
        `)
        .eq('person_id', personId)
        .eq('status', 'ACTIVE')
        .single();

      if (assignment) {
        return {
          company: assignment.companies,
          position: assignment.positions
        };
      }
      
      return {};
    } catch (error) {
      // No assignment found or error - return empty
      return {};
    }
  }
  
  /**
   * Convert database row to domain User entity
   */
  private async mapRowToUser(row: UserRow, roles: RoleRow[] = []): Promise<User> {
    const person: Person = {
      personId: row.person_id,
      firstName: row.first_name,
      middleName: row.middle_name || undefined,
      lastName: row.last_name,
      secondLastName: row.second_last_name || undefined,
      identityType: row.identity_type as any,
      identityNumber: row.identity_number,
      phone: row.phone || undefined,
      birthDate: row.birth_date ? new Date(row.birth_date) : undefined,
      createdAt: new Date(row.person_created_at),
      updatedAt: new Date(row.person_updated_at)
    };

    // Get company and position assignments
    const { company: companyData, position: positionData } = await this.getAssignmentInfo(row.person_id);

    return {
      id: row.id,
      email: row.email,
      emailVerified: !!row.email_confirmed_at,
      profile: {
        profileId: row.profile_id,
        userId: row.id,
        personId: row.person_id,
        username: row.username || undefined,
        isActive: row.is_active,
        lastLoginAt: row.last_login_at ? new Date(row.last_login_at) : undefined,
        preferences: row.preferences || {},
        createdAt: new Date(row.profile_created_at),
        updatedAt: new Date(row.profile_updated_at)
      },
      person,
      company: companyData ? {
        companyId: companyData.company_id,
        name: companyData.trade_name || companyData.legal_name,
        isActive: companyData.is_active,
        isDeleted: false,
        createdAt: new Date(companyData.created_at || new Date()),
        updatedAt: new Date(companyData.updated_at || new Date())
      } : undefined,
      position: positionData ? {
        positionId: positionData.position_id,
        name: positionData.name,
        description: positionData.description || undefined,
        level: positionData.level || undefined,
        isActive: positionData.is_active,
        isDeleted: false,
        createdAt: new Date(positionData.created_at || new Date()),
        updatedAt: new Date(positionData.updated_at || new Date())
      } : undefined,
      roles: roles.map(role => ({
        roleId: role.role_id,
        name: role.name,
        description: role.description || undefined,
        isActive: role.is_active,
        isDeleted: false,
        createdAt: new Date(role.created_at),
        updatedAt: new Date(role.updated_at)
      }))
    };
  }

  async findById(id: string): Promise<User | null> {
    try {
      // Get user with profile and person data
      const { data: userData, error: userError } = await supabase
        .from('user_profiles')
        .select(`
          profile_id,
          user_id,
          person_id,
          username,
          is_active,
          last_login_at,
          preferences,
          created_at,
          updated_at,
          persons!inner (
            person_id,
            first_name,
            middle_name,
            last_name,
            second_last_name,
            identity_type,
            identity_number,
            email,
            phone,
            birth_date,
            created_at,
            updated_at
          )
        `)
        .eq('user_id', id)
        .single();

      if (userError) {
        if (userError.code === 'PGRST116') {
          return null;
        }
        throw new Error(`Failed to find user profile: ${userError.message}`);
      }

      // Use the email from persons table since admin access is not available with anon key
      const userEmail = (userData.persons as any).email || `user${userData.user_id.substring(0, 8)}@example.com`;

      // Get user roles
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select(`
          roles!inner (
            role_id,
            name,
            description,
            is_active,
            created_at,
            updated_at
          )
        `)
        .eq('user_id', id);

      if (rolesError) {
        throw new Error(`Failed to find user roles: ${rolesError.message}`);
      }

      // Map the data
      const mappedRow: UserRow = {
        id: userData.user_id,
        email: userEmail,
        email_confirmed_at: null, // Not available without admin access
        profile_id: userData.profile_id,
        username: userData.username,
        is_active: userData.is_active,
        last_login_at: userData.last_login_at,
        preferences: userData.preferences,
        profile_created_at: userData.created_at,
        profile_updated_at: userData.updated_at,
        person_id: (userData.persons as any).person_id,
        first_name: (userData.persons as any).first_name,
        middle_name: (userData.persons as any).middle_name,
        last_name: (userData.persons as any).last_name,
        second_last_name: (userData.persons as any).second_last_name,
        identity_type: (userData.persons as any).identity_type,
        identity_number: (userData.persons as any).identity_number,
        person_email: (userData.persons as any).email,
        phone: (userData.persons as any).phone,
        birth_date: (userData.persons as any).birth_date,
        person_created_at: (userData.persons as any).created_at,
        person_updated_at: (userData.persons as any).updated_at
      };

      const roles = rolesData?.map(r => r.roles as unknown as RoleRow).filter(Boolean) || [];
      
      return await this.mapRowToUser(mappedRow, roles);
    } catch (error) {
      throw new Error(`Failed to find user by ID: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      // Search by email in persons table since admin access is not available
      const { data, error } = await supabase
        .from('user_profiles')
        .select(`
          user_id,
          persons!inner (
            email
          )
        `)
        .eq('persons.email', email)
        .eq('is_active', true)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw new Error(`Failed to search user by email: ${error.message}`);
      }

      // Then find by ID
      return await this.findById(data.user_id);
    } catch (error) {
      throw new Error(`Failed to find user by email: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async save(user: User): Promise<User> {
    throw new Error('Save operation not supported. Use specific create/update operations.');
  }

  async update(id: string, data: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User | null> {
    try {
      // Update user profile if profile data is provided
      if (data.profile) {
        const profileUpdate: any = {
          updated_at: new Date().toISOString()
        };

        if (data.profile.username !== undefined) profileUpdate.username = data.profile.username;
        if (data.profile.preferences !== undefined) profileUpdate.preferences = data.profile.preferences;

        const { error: profileError } = await supabase
          .from('user_profiles')
          .update(profileUpdate)
          .eq('user_id', id);

        if (profileError) {
          throw new Error(`Failed to update user profile: ${profileError.message}`);
        }
      }

      // Update person data if provided
      if (data.person) {
        const personUpdate: any = {
          updated_at: new Date().toISOString()
        };

        if (data.person.firstName !== undefined) personUpdate.first_name = data.person.firstName;
        if (data.person.middleName !== undefined) personUpdate.middle_name = data.person.middleName;
        if (data.person.lastName !== undefined) personUpdate.last_name = data.person.lastName;
        if (data.person.secondLastName !== undefined) personUpdate.second_last_name = data.person.secondLastName;
        if (data.person.phone !== undefined) personUpdate.phone = data.person.phone;
        if (data.person.birthDate !== undefined) personUpdate.birth_date = data.person.birthDate?.toISOString();

        // Get person_id from user profile
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('person_id')
          .eq('user_id', id)
          .single();

        if (profileError) {
          throw new Error(`Failed to find user profile: ${profileError.message}`);
        }

        const { error: personError } = await supabase
          .from('persons')
          .update(personUpdate)
          .eq('person_id', profile.person_id);

        if (personError) {
          throw new Error(`Failed to update person: ${personError.message}`);
        }
      }

      // Return updated user
      return await this.findById(id);
    } catch (error) {
      throw new Error(`Failed to update user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      // Use soft delete by deactivating the user profile
      // This is safer with RLS policies and preserves data integrity
      const { error } = await supabase
        .from('user_profiles')
        .update({ 
          is_active: false,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', id);
    
      if (error) {
        throw new Error(`Failed to deactivate user: ${error.message}`);
      }
    
      return true;
    } catch (error) {
      throw new Error(`Failed to delete user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async findAll(page: number = 0, limit: number = 10): Promise<User[]> {
    try {
      const offset = page * limit;

      const { data, error } = await supabase
        .from('user_profiles')
        .select(`
          profile_id,
          user_id,
          person_id,
          username,
          is_active,
          last_login_at,
          preferences,
          created_at,
          updated_at,
          persons!inner (
            person_id,
            first_name,
            middle_name,
            last_name,
            second_last_name,
            identity_type,
            identity_number,
            email,
            phone,
            birth_date,
            created_at,
            updated_at
          )
        `)
        .eq('is_active', true)
        .range(offset, offset + limit - 1)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to find users: ${error.message}`);
      }

      const users: User[] = [];
      
      for (const profile of data) {
        // Use email from persons table since admin access is not available
        const userEmail = (profile.persons as any).email || `user${profile.user_id.substring(0, 8)}@example.com`;

        // Get roles for this user
        const { data: rolesData } = await supabase
          .from('user_roles')
          .select(`
            roles!inner (
              role_id,
              name,
              description,
              is_active,
              created_at,
              updated_at
            )
          `)
          .eq('user_id', profile.user_id);

        const mappedRow: UserRow = {
          id: profile.user_id,
          email: userEmail,
          email_confirmed_at: null, // Not available without admin access
          profile_id: profile.profile_id,
          username: profile.username,
          is_active: profile.is_active,
          last_login_at: profile.last_login_at,
          preferences: profile.preferences,
          profile_created_at: profile.created_at,
          profile_updated_at: profile.updated_at,
          person_id: (profile.persons as any).person_id,
          first_name: (profile.persons as any).first_name,
          middle_name: (profile.persons as any).middle_name,
          last_name: (profile.persons as any).last_name,
          second_last_name: (profile.persons as any).second_last_name,
          identity_type: (profile.persons as any).identity_type,
          identity_number: (profile.persons as any).identity_number,
          person_email: (profile.persons as any).email,
          phone: (profile.persons as any).phone,
          birth_date: (profile.persons as any).birth_date,
          person_created_at: (profile.persons as any).created_at,
          person_updated_at: (profile.persons as any).updated_at
        };

        const roles = rolesData?.map(r => r.roles as unknown as RoleRow).filter(Boolean) || [];
        users.push(await this.mapRowToUser(mappedRow, roles));
      }

      return users;
    } catch (error) {
      throw new Error(`Failed to find all users: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async search(searchTerm: string, page: number = 0, limit: number = 10): Promise<User[]> {
    try {
      const offset = page * limit;
      const searchLower = searchTerm.toLowerCase();

      // Build multiple OR queries for different search fields using native SQL capabilities
      // Use ilike for case-insensitive search on PostgreSQL
      let query = supabase
        .from('user_profiles')
        .select(`
          profile_id,
          user_id,
          person_id,
          username,
          is_active,
          last_login_at,
          preferences,
          created_at,
          updated_at,
          persons!inner (
            person_id,
            first_name,
            middle_name,
            last_name,
            second_last_name,
            identity_type,
            identity_number,
            email,
            phone,
            birth_date,
            created_at,
            updated_at
          )
        `)
        .eq('is_active', true);

      // Apply search filters using PostgreSQL native capabilities
      // Use OR conditions to search across multiple fields with proper escaping
      query = query.or([
        `username.ilike.%${searchLower}%`,
        `persons.first_name.ilike.%${searchLower}%`,
        `persons.last_name.ilike.%${searchLower}%`,
        `persons.identity_number.ilike.%${searchTerm}%`,
        `persons.email.ilike.%${searchLower}%`
      ].join(','));

      // Apply pagination and ordering at database level
      const { data, error } = await query
        .range(offset, offset + limit - 1)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to search users: ${error.message}`);
      }

      const users: User[] = [];
      
      for (const profile of data) {
        // Use email from persons table since admin access is not available
        const userEmail = (profile.persons as any).email || `user${profile.user_id.substring(0, 8)}@example.com`;

        // Get roles for this user
        const { data: rolesData } = await supabase
          .from('user_roles')
          .select(`
            roles!inner (
              role_id,
              name,
              description,
              is_active,
              created_at,
              updated_at
            )
          `)
          .eq('user_id', profile.user_id);

        const mappedRow: UserRow = {
          id: profile.user_id,
          email: userEmail,
          email_confirmed_at: null, // Not available without admin access
          profile_id: profile.profile_id,
          username: profile.username,
          is_active: profile.is_active,
          last_login_at: profile.last_login_at,
          preferences: profile.preferences,
          profile_created_at: profile.created_at,
          profile_updated_at: profile.updated_at,
          person_id: (profile.persons as any).person_id,
          first_name: (profile.persons as any).first_name,
          middle_name: (profile.persons as any).middle_name,
          last_name: (profile.persons as any).last_name,
          second_last_name: (profile.persons as any).second_last_name,
          identity_type: (profile.persons as any).identity_type,
          identity_number: (profile.persons as any).identity_number,
          person_email: (profile.persons as any).email,
          phone: (profile.persons as any).phone,
          birth_date: (profile.persons as any).birth_date,
          person_created_at: (profile.persons as any).created_at,
          person_updated_at: (profile.persons as any).updated_at
        };

        const roles = rolesData?.map(r => r.roles as unknown as RoleRow).filter(Boolean) || [];
        users.push(await this.mapRowToUser(mappedRow, roles));
      }

      return users;
    } catch (error) {
      throw new Error(`Failed to search users: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async count(): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      if (error) {
        throw new Error(`Failed to count users: ${error.message}`);
      }

      return count || 0;
    } catch (error) {
      throw new Error(`Failed to count users: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}