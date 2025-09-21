import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProfessorRepository } from '@domain/repositories/professor.repository';
import { Professor } from '@domain/entities/professor.entity';
import { ProfessorSchema } from '../schemas/professor.schema';

@Injectable()
export class PostgresProfessorRepository implements ProfessorRepository {
  constructor(
    @InjectRepository(ProfessorSchema)
    private readonly repository: Repository<ProfessorSchema>,
  ) {}

  async findById(id: string): Promise<Professor | null> {
    const schema = await this.repository.findOne({
      where: { id },
      relations: ['department', 'title'],
    });

    if (!schema) return null;

    return new Professor(
      schema.id,
      schema.departmentId,
      schema.titleId,
      schema.name,
    );
  }

  async findAll(): Promise<Professor[]> {
    const schemas = await this.repository.find({
      relations: ['department', 'title'],
    });

    return schemas.map(
      (schema) =>
        new Professor(
          schema.id,
          schema.departmentId,
          schema.titleId,
          schema.name,
        ),
    );
  }

  async findByDepartmentId(departmentId: string): Promise<Professor[]> {
    const schemas = await this.repository.find({
      where: { departmentId },
      relations: ['department', 'title'],
    });

    return schemas.map(
      (schema) =>
        new Professor(
          schema.id,
          schema.departmentId,
          schema.titleId,
          schema.name,
        ),
    );
  }

  async save(professor: Professor): Promise<Professor> {
    const schema = new ProfessorSchema();
    schema.id = professor.id;
    schema.departmentId = professor.departmentId;
    schema.titleId = professor.titleId;
    schema.name = professor.name;
    schema.createdAt = professor.insertedAt;
    schema.updatedAt = professor.updatedAt;

    const savedSchema = await this.repository.save(schema);
    return new Professor(
      savedSchema.id,
      savedSchema.departmentId,
      savedSchema.titleId,
      savedSchema.name,
    );
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async getProfessorTeachingHours(professorId: string): Promise<number> {
    const result = await this.repository.query(
      `
      SELECT COALESCE(SUM(
        EXTRACT(EPOCH FROM (cs.end_time::time - cs.start_time::time)) / 3600
      ), 0) as total_hours
      FROM class_schedules cs
      JOIN classes c ON cs.class_id = c.id
      JOIN subjects s ON c.subject_id = s.id
      WHERE s.professor_id = $1
    `,
      [professorId],
    );

    return parseFloat(result[0]?.total_hours || '0');
  }

  async getAllProfessorsTeachingHours(): Promise<
    Array<{
      professorId: string;
      professorName: string;
      departmentName: string;
      titleName: string;
      totalHours: number;
    }>
  > {
    const result = await this.repository.query(`
      SELECT 
        p.id as professor_id,
        p.name as professor_name,
        d.name as department_name,
        t.name as title_name,
        COALESCE(SUM(
          EXTRACT(EPOCH FROM (cs.end_time::time - cs.start_time::time)) / 3600
        ), 0) as total_hours
      FROM professors p
      LEFT JOIN departments d ON p.department_id = d.id
      LEFT JOIN titles t ON p.title_id = t.id
      LEFT JOIN subjects s ON s.professor_id = p.id
      LEFT JOIN classes c ON c.subject_id = s.id
      LEFT JOIN class_schedules cs ON cs.class_id = c.id
      GROUP BY p.id, p.name, d.name, t.name
      ORDER BY total_hours DESC, p.name
    `);

    return result.map((row: any) => ({
      professorId: row.professor_id,
      professorName: row.professor_name,
      departmentName: row.department_name,
      titleName: row.title_name,
      totalHours: parseFloat(row.total_hours),
    }));
  }
}
