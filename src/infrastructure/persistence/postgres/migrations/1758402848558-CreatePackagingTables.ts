import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePackagingTables1758402848558 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Ensure uuid-ossp extension exists
    await queryRunner.query(
      `CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public`,
    );

    // Create products table
    await queryRunner.query(
      `CREATE TABLE "products" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "product_id" varchar(255) NOT NULL,
        "height" numeric(8,2) NOT NULL,
        "width" numeric(8,2) NOT NULL,
        "length" numeric(8,2) NOT NULL,
        "inserted_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP,
        CONSTRAINT "PK_product_id" PRIMARY KEY ("id"),
        CONSTRAINT "CHK_product_dimensions_positive" CHECK ("height" > 0 AND "width" > 0 AND "length" > 0)
      )`,
    );

    // Create boxes table
    await queryRunner.query(
      `CREATE TABLE "boxes" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "box_id" varchar(255) NOT NULL,
        "height" numeric(8,2) NOT NULL,
        "width" numeric(8,2) NOT NULL,
        "length" numeric(8,2) NOT NULL,
        "is_active" boolean NOT NULL DEFAULT true,
        "inserted_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP,
        CONSTRAINT "PK_box_id" PRIMARY KEY ("id"),
        CONSTRAINT "UK_box_box_id" UNIQUE ("box_id"),
        CONSTRAINT "CHK_box_dimensions_positive" CHECK ("height" > 0 AND "width" > 0 AND "length" > 0)
      )`,
    );

    // Create orders table
    await queryRunner.query(
      `CREATE TABLE "orders" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "order_id" varchar(255) NOT NULL,
        "inserted_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP,
        CONSTRAINT "PK_order_id" PRIMARY KEY ("id"),
        CONSTRAINT "UK_order_order_id" UNIQUE ("order_id")
      )`,
    );

    // Create order_products table (junction table)
    await queryRunner.query(
      `CREATE TABLE "order_products" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "order_id" uuid NOT NULL,
        "product_id" uuid NOT NULL,
        "inserted_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP,
        CONSTRAINT "PK_order_product_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_order_product_order_id" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_order_product_product_id" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE
      )`,
    );

    // Create packaging_results table
    await queryRunner.query(
      `CREATE TABLE "packaging_results" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "order_id" uuid NOT NULL,
        "box_id" uuid,
        "box_type" varchar(255),
        "products_json" jsonb NOT NULL,
        "observation" text,
        "inserted_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP,
        CONSTRAINT "PK_packaging_result_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_packaging_result_order_id" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_packaging_result_box_id" FOREIGN KEY ("box_id") REFERENCES "boxes"("id") ON DELETE SET NULL
      )`,
    );

    // Create indexes for better performance
    await queryRunner.query(
      `CREATE INDEX "IDX_products_product_id" ON "products" ("product_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_boxes_box_id" ON "boxes" ("box_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_boxes_is_active" ON "boxes" ("is_active")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_orders_order_id" ON "orders" ("order_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_order_products_order_id" ON "order_products" ("order_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_order_products_product_id" ON "order_products" ("product_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_packaging_results_order_id" ON "packaging_results" ("order_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_packaging_results_box_id" ON "packaging_results" ("box_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_packaging_results_box_id"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_packaging_results_order_id"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_order_products_product_id"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_order_products_order_id"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_orders_order_id"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_boxes_is_active"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_boxes_box_id"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_products_product_id"`);

    // Drop tables in reverse order
    await queryRunner.query(`DROP TABLE IF EXISTS "packaging_results"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "order_products"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "orders"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "boxes"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "products"`);
  }
}
