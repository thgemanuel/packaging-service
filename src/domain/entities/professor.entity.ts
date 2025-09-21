import { AbstractEntity } from './abstract.entity';

export class Professor extends AbstractEntity {
  constructor(
    public readonly id: string,
    public readonly departmentId: string,
    public readonly titleId: string,
    public readonly name: string,
  ) {
    super();
    this.id = id;
    this.departmentId = departmentId;
    this.titleId = titleId;
    this.name = name;
    this.insertedAt = new Date();
    this.updatedAt = new Date();
  }

  static create(
    departmentId: string,
    titleId: string,
    name: string,
  ): Professor {
    return new Professor(crypto.randomUUID(), departmentId, titleId, name);
  }
}
