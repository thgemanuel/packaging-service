import { AbstractEntity } from './abstract.entity';

export class Title extends AbstractEntity {
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

  static create(name: string): Title {
    return new Title(crypto.randomUUID(), name);
  }
}
