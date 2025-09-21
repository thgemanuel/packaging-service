import { Injectable, Inject } from '@nestjs/common';
import { ProfessorRepository } from '@domain/repositories/professor.repository';

export interface ProfessorTeachingHours {
  professorId: string;
  professorName: string;
  departmentName: string;
  titleName: string;
  totalHours: number;
}

@Injectable()
export class GetProfessorsTeachingHoursUseCase {
  constructor(
    @Inject('ProfessorRepository')
    private readonly professorRepository: ProfessorRepository,
  ) {}

  async execute(): Promise<ProfessorTeachingHours[]> {
    const result =
      await this.professorRepository.getAllProfessorsTeachingHours();
    return result.map((item) => ({
      professorId: item.professorId,
      professorName: item.professorName,
      departmentName: item.departmentName,
      titleName: item.titleName,
      totalHours: item.totalHours,
    }));
  }
}
