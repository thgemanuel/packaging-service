import { Building } from '../entities/building.entity';

export interface BuildingRepository {
  findById(id: string): Promise<Building | null>;
  findAll(): Promise<Building[]>;
  save(building: Building): Promise<Building>;
  delete(id: string): Promise<void>;
}
