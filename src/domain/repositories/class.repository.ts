import { Class } from '../entities/class.entity';

export interface ClassRepository {
  findById(id: string): Promise<Class | null>;
  findAll(): Promise<Class[]>;
  findBySubjectId(subjectId: string): Promise<Class[]>;
  findByYearAndSemester(year: number, semester: number): Promise<Class[]>;
  save(classEntity: Class): Promise<Class>;
  delete(id: string): Promise<void>;
}
