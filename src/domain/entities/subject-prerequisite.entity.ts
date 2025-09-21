import { AbstractEntity } from './abstract.entity';

export class SubjectPrerequisite extends AbstractEntity {
  constructor(
    public readonly id: string,
    public readonly subjectId: string,
    public readonly prerequisiteId: string,
  ) {
    super();
    this.id = id;
    this.subjectId = subjectId;
    this.prerequisiteId = prerequisiteId;
    this.insertedAt = new Date();
    this.updatedAt = new Date();
  }

  static create(
    subjectId: string,
    prerequisiteId: string,
  ): SubjectPrerequisite {
    return new SubjectPrerequisite(
      crypto.randomUUID(),
      subjectId,
      prerequisiteId,
    );
  }
}
