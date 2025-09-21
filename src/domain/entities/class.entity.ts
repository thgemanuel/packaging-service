import { AbstractEntity } from './abstract.entity';

export class Class extends AbstractEntity {
  constructor(
    public readonly id: string,
    public readonly subjectId: string,
    public readonly year: number,
    public readonly semester: number,
    public readonly code: string,
    public readonly maxStudents?: number,
  ) {
    super();
    this.id = id;
    this.subjectId = subjectId;
    this.year = year;
    this.semester = semester;
    this.code = code;
    this.maxStudents = maxStudents;
    this.insertedAt = new Date();
    this.updatedAt = new Date();
  }

  static create(
    subjectId: string,
    year: number,
    semester: number,
    code: string,
    maxStudents?: number,
  ): Class {
    return new Class(
      crypto.randomUUID(),
      subjectId,
      year,
      semester,
      code,
      maxStudents,
    );
  }
}
