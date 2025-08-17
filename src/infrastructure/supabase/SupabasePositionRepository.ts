import { PositionRepository } from '../../domain/position/PositionRepository';
import { Position, CreatePositionData, UpdatePositionData } from '../../domain/position/Position';
import { supabase } from './supabaseClient';

/**
 * Database row structure for positions table
 */
interface PositionRow {
  position_id: number;
  name: string;
  description: string | null;
  department: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Supabase implementation of PositionRepository
 */
export class SupabasePositionRepository implements PositionRepository {
  
  private mapRowToPosition(row: PositionRow): Position {
    return {
      positionId: row.position_id,
      name: row.name,
      description: row.description || undefined,
      department: row.department || undefined,
      isActive: row.is_active,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    };
  }

  async findAll(): Promise<Position[]> {
    try {
      const { data, error } = await supabase
        .from('positions')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) {
        throw new Error(`Failed to find positions: ${error.message}`);
      }

      return data.map(row => this.mapRowToPosition(row));
    } catch (error) {
      throw new Error(`Failed to find all positions: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async findById(id: number): Promise<Position | null> {
    try {
      const { data, error } = await supabase
        .from('positions')
        .select('*')
        .eq('position_id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw new Error(`Failed to find position: ${error.message}`);
      }

      return this.mapRowToPosition(data);
    } catch (error) {
      throw new Error(`Failed to find position by ID: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async create(data: CreatePositionData): Promise<Position> {
    try {
      const { data: result, error } = await supabase
        .from('positions')
        .insert({
          name: data.name,
          description: data.description || null,
          department: data.department || null,
          is_active: true
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to create position: ${error.message}`);
      }

      return this.mapRowToPosition(result);
    } catch (error) {
      throw new Error(`Failed to create position: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async update(id: number, data: UpdatePositionData): Promise<Position | null> {
    try {
      const updateData: Partial<PositionRow> = {
        updated_at: new Date().toISOString()
      };

      if (data.name !== undefined) updateData.name = data.name;
      if (data.description !== undefined) updateData.description = data.description || null;
      if (data.department !== undefined) updateData.department = data.department || null;
      if (data.isActive !== undefined) updateData.is_active = data.isActive;

      const { data: result, error } = await supabase
        .from('positions')
        .update(updateData)
        .eq('position_id', id)
        .select()
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw new Error(`Failed to update position: ${error.message}`);
      }

      return this.mapRowToPosition(result);
    } catch (error) {
      throw new Error(`Failed to update position: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      // Soft delete by setting is_active to false
      const { error } = await supabase
        .from('positions')
        .update({ 
          is_active: false,
          updated_at: new Date().toISOString()
        })
        .eq('position_id', id);

      if (error) {
        throw new Error(`Failed to delete position: ${error.message}`);
      }

      return true;
    } catch (error) {
      throw new Error(`Failed to delete position: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}