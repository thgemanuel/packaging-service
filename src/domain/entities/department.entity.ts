import { AbstractEntity } from './abstract.entity';

export class Department extends AbstractEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
  ) {
    super();
    this.id = id;
    this.name = name;
    this.insertedAt = new Date();
    this.updatedAt = new Date();
  }

  static create(name: string): Department {
    return new Department(crypto.randomUUID(), name);
  }
}
