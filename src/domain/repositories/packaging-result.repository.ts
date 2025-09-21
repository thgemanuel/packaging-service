import { PackagingResult } from '../entities/packaging-result.entity';

export interface PackagingResultRepository {
  findByOrderId(orderId: string): Promise<PackagingResult[]>;
  save(result: PackagingResult): Promise<PackagingResult>;
  saveMany(results: PackagingResult[]): Promise<PackagingResult[]>;
  upsert(result: PackagingResult): Promise<PackagingResult>;
  upsertMany(results: PackagingResult[]): Promise<PackagingResult[]>;
}

export const PACKAGING_RESULT_REPOSITORY_NAME = 'PackagingResultRepository';
