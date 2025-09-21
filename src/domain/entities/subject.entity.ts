import { AbstractEntity } from './abstract.entity';

export class Subject extends AbstractEntity {
  constructor(
    public readonly id: string,
    public readonly code: string,
    public readonly name: string,
    public readonly credits: number,
    public readonly professorId?: string,
  ) {
    super();
    this.id = id;
    this.code = code;
    this.name = name;
    this.credits = credits;
    this.professorId = professorId;
    this.insertedAt = new Date();
    this.updatedAt = new Date();
  }

  static create(
    code: string,
    name: string,
    credits: number,
    professorId?: string,
  ): Subject {
    return new Subject(crypto.randomUUID(), code, name, credits, professorId);
  }
}
