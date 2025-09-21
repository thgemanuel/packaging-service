import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBoxTypeColumn1758402848560 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add box_type column to boxes table
    await queryRunner.query(
      `ALTER TABLE "boxes" ADD COLUMN "box_type" varchar(255)`,
    );

    // Update existing records with box_type values based on box_id
    await queryRunner.query(
      `UPDATE "boxes" SET "box_type" = "box_id"`,
    );

    // Make box_type NOT NULL
    await queryRunner.query(
      `ALTER TABLE "boxes" ALTER COLUMN "box_type" SET NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove box_type column
    await queryRunner.query(
      `ALTER TABLE "boxes" DROP COLUMN "box_type"`,
    );
  }
}
