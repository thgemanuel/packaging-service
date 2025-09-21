import { SubjectPrerequisite } from '../entities/subject-prerequisite.entity';

export interface SubjectPrerequisiteRepository {
  findById(id: string): Promise<SubjectPrerequisite | null>;
  findBySubjectId(subjectId: string): Promise<SubjectPrerequisite[]>;
  findByPrerequisiteId(prerequisiteId: string): Promise<SubjectPrerequisite[]>;
  save(subjectPrerequisite: SubjectPrerequisite): Promise<SubjectPrerequisite>;
  delete(id: string): Promise<void>;
}
