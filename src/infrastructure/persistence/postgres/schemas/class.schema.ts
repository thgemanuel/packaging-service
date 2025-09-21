import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { SubjectSchema } from './subject.schema';

@Entity('classes')
export class ClassSchema {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'subject_id', type: 'uuid' })
  subjectId: string;

  @Column({ type: 'int' })
  year: number;

  @Column({ type: 'int' })
  semester: number;

  @Column({ type: 'varchar', length: 100 })
  code: string;

  @Column({ name: 'max_students', type: 'int', nullable: true })
  maxStudents: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => SubjectSchema)
  @JoinColumn({ name: 'subject_id' })
  subject: SubjectSchema;
}
