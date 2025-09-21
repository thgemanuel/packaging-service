import { Department } from '../entities/department.entity';

export interface DepartmentRepository {
  findById(id: string): Promise<Department | null>;
  findAll(): Promise<Department[]>;
  save(department: Department): Promise<Department>;
  delete(id: string): Promise<void>;
}
