import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BuildingSchema } from './building.schema';

@Entity('rooms')
export class RoomSchema {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'building_id', type: 'uuid' })
  buildingId: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'int', nullable: true })
  capacity: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => BuildingSchema)
  @JoinColumn({ name: 'building_id' })
  building: BuildingSchema;
}
