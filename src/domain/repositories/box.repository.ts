import { Box } from '../entities/box.entity';
import { BoxType } from '../enums/box-type.enum';

export interface BoxRepository {
  findAll(): Promise<Box[]>;
  findActive(): Promise<Box[]>;
  findByBoxId(boxId: string): Promise<Box | null>;
  findByBoxType(boxType: BoxType): Promise<Box | null>;
}

export const BOX_REPOSITORY_NAME = 'BoxRepository';
