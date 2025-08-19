import { Position, CreatePositionData, UpdatePositionData } from './Position';

/**
 * Repository interface for position operations
 */
export interface PositionRepository {
  /**
   * Find all active positions
   * @returns Promise resolving to array of positions
   */
  findAll(): Promise<Position[]>;
  
  /**
   * Find position by ID
   * @param id Position ID to search for
   * @returns Promise resolving to Position or null if not found
   */
  findById(id: number): Promise<Position | null>;
  
  /**
   * Create new position
   * @param data Position creation data
   * @returns Promise resolving to the created Position
   */
  create(data: CreatePositionData): Promise<Position>;
  
  /**
   * Update position
   * @param id Position ID to update
   * @param data Position update data
   * @returns Promise resolving to updated Position or null if not found
   */
  update(id: number, data: UpdatePositionData): Promise<Position | null>;
  
  /**
   * Delete position by ID
   * @param id Position ID to delete
   * @returns Promise resolving to boolean indicating success
   */
  delete(id: number): Promise<boolean>;
}