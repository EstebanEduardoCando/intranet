import { supabase } from './supabaseClient';
import { Person } from '../../domain/user/Person';

/**
 * Database row structure for persons table
 */
interface PersonRow {
  person_id: number;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  second_last_name: string | null;
  identity_type: string;
  identity_number: string;
  email: string | null;
  phone: string | null;
  birth_date: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Supabase implementation for Person repository
 */
export class SupabasePersonRepository {
  
  /**
   * Convert database row to domain Person entity
   */
  private mapRowToPerson(row: PersonRow): Person {
    return {
      personId: row.person_id,
      firstName: row.first_name,
      middleName: row.middle_name || undefined,
      lastName: row.last_name,
      secondLastName: row.second_last_name || undefined,
      identityType: row.identity_type as Person['identityType'],
      identityNumber: row.identity_number,
      email: row.email || undefined,
      phone: row.phone || undefined,
      birthDate: row.birth_date ? new Date(row.birth_date) : undefined,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    };
  }
  
  /**
   * Convert domain Person entity to database row for insert/update
   */
  private mapPersonToRow(person: Omit<Person, 'personId' | 'createdAt' | 'updatedAt'>): Omit<PersonRow, 'person_id' | 'created_at' | 'updated_at'> {
    return {
      first_name: person.firstName,
      middle_name: person.middleName || null,
      last_name: person.lastName,
      second_last_name: person.secondLastName || null,
      identity_type: person.identityType,
      identity_number: person.identityNumber,
      email: person.email || null,
      phone: person.phone || null,
      birth_date: person.birthDate ? person.birthDate.toISOString().split('T')[0] : null
    };
  }
  
  async findById(personId: number): Promise<Person | null> {
    const { data, error } = await supabase
      .from('persons')
      .select('*')
      .eq('person_id', personId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return null; // No rows returned
      }
      throw new Error(`Failed to find person by ID: ${error.message}`);
    }
    
    return this.mapRowToPerson(data);
  }
  
  async findByIdentity(identityType: string, identityNumber: string): Promise<Person | null> {
    const { data, error } = await supabase
      .from('persons')
      .select('*')
      .eq('identity_type', identityType)
      .eq('identity_number', identityNumber)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return null; // No rows returned
      }
      throw new Error(`Failed to find person by identity: ${error.message}`);
    }
    
    return this.mapRowToPerson(data);
  }
  
  async findByEmail(email: string): Promise<Person | null> {
    const { data, error } = await supabase
      .from('persons')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return null; // No rows returned
      }
      throw new Error(`Failed to find person by email: ${error.message}`);
    }
    
    return this.mapRowToPerson(data);
  }
  
  async create(personData: Omit<Person, 'personId' | 'createdAt' | 'updatedAt'>): Promise<Person> {
    const row = this.mapPersonToRow(personData);
    
    const { data, error } = await supabase
      .from('persons')
      .insert(row)
      .select()
      .single();
    
    if (error) {
      throw new Error(`Failed to create person: ${error.message}`);
    }
    
    return this.mapRowToPerson(data);
  }
  
  async update(personId: number, updateData: Partial<Omit<Person, 'personId' | 'createdAt' | 'updatedAt'>>): Promise<Person | null> {
    const rowUpdateData: Partial<PersonRow> = {};
    
    if (updateData.firstName !== undefined) rowUpdateData.first_name = updateData.firstName;
    if (updateData.middleName !== undefined) rowUpdateData.middle_name = updateData.middleName || null;
    if (updateData.lastName !== undefined) rowUpdateData.last_name = updateData.lastName;
    if (updateData.secondLastName !== undefined) rowUpdateData.second_last_name = updateData.secondLastName || null;
    if (updateData.identityType !== undefined) rowUpdateData.identity_type = updateData.identityType;
    if (updateData.identityNumber !== undefined) rowUpdateData.identity_number = updateData.identityNumber;
    if (updateData.email !== undefined) rowUpdateData.email = updateData.email || null;
    if (updateData.phone !== undefined) rowUpdateData.phone = updateData.phone || null;
    if (updateData.birthDate !== undefined) {
      rowUpdateData.birth_date = updateData.birthDate ? updateData.birthDate.toISOString().split('T')[0] : null;
    }
    
    const { data, error } = await supabase
      .from('persons')
      .update(rowUpdateData)
      .eq('person_id', personId)
      .select()
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return null; // No rows updated
      }
      throw new Error(`Failed to update person: ${error.message}`);
    }
    
    return this.mapRowToPerson(data);
  }
  
  async delete(personId: number): Promise<boolean> {
    const { error } = await supabase
      .from('persons')
      .delete()
      .eq('person_id', personId);
    
    if (error) {
      throw new Error(`Failed to delete person: ${error.message}`);
    }
    
    return true;
  }
}