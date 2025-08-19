import { Position } from '../../domain/position/Position';
import { PositionRepository } from '../../domain/position/PositionRepository';

export class GetPositions {
  constructor(private positionRepository: PositionRepository) {}

  async execute(): Promise<Position[]> {
    try {
      return await this.positionRepository.findAll();
    } catch (error) {
      throw new Error(`Error fetching positions: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}