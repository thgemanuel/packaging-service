import { Subject } from '../entities/subject.entity';

export interface SubjectRepository {
  findById(id: string): Promise<Subject | null>;
  findAll(): Promise<Subject[]>;
  findByProfessorId(professorId: string): Promise<Subject[]>;
  save(subject: Subject): Promise<Subject>;
  delete(id: string): Promise<void>;
}
