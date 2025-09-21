import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ClassSchema } from './class.schema';
import { RoomSchema } from './room.schema';

@Entity('class_schedules')
export class ClassScheduleSchema {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'class_id', type: 'uuid' })
  classId: string;

  @Column({ name: 'room_id', type: 'uuid' })
  roomId: string;

  @Column({ name: 'day_of_week', type: 'varchar', length: 20 })
  dayOfWeek: string;

  @Column({ name: 'start_time', type: 'varchar', length: 10 })
  startTime: string;

  @Column({ name: 'end_time', type: 'varchar', length: 10 })
  endTime: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => ClassSchema)
  @JoinColumn({ name: 'class_id' })
  class: ClassSchema;

  @ManyToOne(() => RoomSchema)
  @JoinColumn({ name: 'room_id' })
  room: RoomSchema;
}
