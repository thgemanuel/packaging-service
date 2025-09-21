import { AbstractEntity } from './abstract.entity';

export class Room extends AbstractEntity {
  constructor(
    public readonly id: string,
    public readonly buildingId: string,
    public readonly name: string,
    public readonly capacity?: number,
  ) {
    super();
    this.id = id;
    this.buildingId = buildingId;
    this.name = name;
    this.capacity = capacity;
    this.insertedAt = new Date();
    this.updatedAt = new Date();
  }

  static create(buildingId: string, name: string, capacity?: number): Room {
    return new Room(crypto.randomUUID(), buildingId, name, capacity);
  }
}
