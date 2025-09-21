import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedBoxesData1758402848559 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Insert the 3 available box types
    await queryRunner.query(
      `INSERT INTO "boxes" ("box_id", "height", "width", "length") VALUES
        ('Caixa 1', 30, 40, 80),
        ('Caixa 2', 50, 50, 40),
        ('Caixa 3', 50, 80, 60)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove the seeded box data
    await queryRunner.query(
      `DELETE FROM "boxes" WHERE "box_id" IN ('Caixa 1', 'Caixa 2', 'Caixa 3')`,
    );
  }
}
