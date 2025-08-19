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
  level: string | null;
  is_active: boolean;
  created_by: string | null;
  updated_by: string | null;
  version: number;
  is_deleted: boolean;
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
      level: row.level || undefined,
      isActive: row.is_active,
      isDeleted: row.is_deleted,
      version: row.version,
      createdBy: row.created_by || undefined,
      updatedBy: row.updated_by || undefined,
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
        .eq('is_deleted', false)
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
        .eq('is_deleted', false)
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

  async create(data: CreatePositionData, userId?: string): Promise<Position> {
    try {
      const { data: result, error } = await supabase
        .from('positions')
        .insert({
          name: data.name,
          description: data.description || null,
          level: data.level || null,
          is_active: true,
          created_by: userId || null,
          updated_by: userId || null,
          version: 1,
          is_deleted: false
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

  async update(id: number, data: UpdatePositionData, userId?: string): Promise<Position | null> {
    try {
      const updateData: Partial<PositionRow> = {
        updated_at: new Date().toISOString(),
        updated_by: userId || null
      };

      if (data.name !== undefined) updateData.name = data.name;
      if (data.description !== undefined) updateData.description = data.description || null;
      if (data.level !== undefined) updateData.level = data.level || null;
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

  async delete(id: number, userId?: string): Promise<boolean> {
    try {
      // Soft delete by setting is_deleted to true
      const { error } = await supabase
        .from('positions')
        .update({ 
          is_deleted: true,
          is_active: false,
          updated_at: new Date().toISOString(),
          updated_by: userId || null
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