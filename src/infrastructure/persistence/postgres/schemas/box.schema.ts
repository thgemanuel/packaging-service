import { Column, Entity, OneToMany } from 'typeorm';
import { AbstractSchema } from './abstract.schema';
import type { PackagingResultTypeORM } from './packaging-result.schema';

@Entity('boxes')
export class BoxTypeORM extends AbstractSchema {
  @Column({ name: 'box_id', type: 'varchar', length: 255, unique: true })
  boxId: string;

  @Column({ name: 'box_type', type: 'varchar', length: 255 })
  boxType: string;

  @Column({ name: 'height', type: 'decimal', precision: 8, scale: 2 })
  height: number;

  @Column({ name: 'width', type: 'decimal', precision: 8, scale: 2 })
  width: number;

  @Column({ name: 'length', type: 'decimal', precision: 8, scale: 2 })
  length: number;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @OneToMany('PackagingResultTypeORM', 'box', {
    lazy: true,
    cascade: ['insert'],
  })
  packagingResults?: Promise<PackagingResultTypeORM[]>;
}
