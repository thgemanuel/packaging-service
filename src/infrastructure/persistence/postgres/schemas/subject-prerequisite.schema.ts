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

@Entity('subject_prerequisites')
export class SubjectPrerequisiteSchema {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'subject_id', type: 'uuid' })
  subjectId: string;

  @Column({ name: 'prerequisite_id', type: 'uuid' })
  prerequisiteId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => SubjectSchema)
  @JoinColumn({ name: 'subject_id' })
  subject: SubjectSchema;

  @ManyToOne(() => SubjectSchema)
  @JoinColumn({ name: 'prerequisite_id' })
  prerequisite: SubjectSchema;
}
