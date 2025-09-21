export class AbstractEntity {
  id: string;
  insertedAt: Date;
  updatedAt: Date;

  protected touch(): void {
    this.updatedAt = new Date();
  }
}
