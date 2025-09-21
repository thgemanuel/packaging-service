import { Professor } from '../entities/professor.entity';

export interface ProfessorRepository {
  findById(id: string): Promise<Professor | null>;
  findAll(): Promise<Professor[]>;
  findByDepartmentId(departmentId: string): Promise<Professor[]>;
  save(professor: Professor): Promise<Professor>;
  delete(id: string): Promise<void>;
  getProfessorTeachingHours(professorId: string): Promise<number>;
  getAllProfessorsTeachingHours(): Promise<
    Array<{
      professorId: string;
      professorName: string;
      departmentName: string;
      titleName: string;
      totalHours: number;
    }>
  >;
}
