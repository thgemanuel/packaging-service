import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { DepartmentSchema } from './department.schema';
import { TitleSchema } from './title.schema';

@Entity('professors')
export class ProfessorSchema {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'department_id', type: 'uuid' })
  departmentId: string;

  @Column({ name: 'title_id', type: 'uuid' })
  titleId: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => DepartmentSchema)
  @JoinColumn({ name: 'department_id' })
  department: DepartmentSchema;

  @ManyToOne(() => TitleSchema)
  @JoinColumn({ name: 'title_id' })
  title: TitleSchema;
}
