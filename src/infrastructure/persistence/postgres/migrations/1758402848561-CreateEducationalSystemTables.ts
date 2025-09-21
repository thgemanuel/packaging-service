import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateEducationalSystemTables1758402848561
  implements MigrationInterface
{
  name = 'CreateEducationalSystemTables1758402848561';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create departments table
    await queryRunner.query(`
      CREATE TABLE "departments" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_departments" PRIMARY KEY ("id")
      )
    `);

    // Create titles table
    await queryRunner.query(`
      CREATE TABLE "titles" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_titles" PRIMARY KEY ("id")
      )
    `);

    // Create professors table
    await queryRunner.query(`
      CREATE TABLE "professors" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "department_id" uuid NOT NULL,
        "title_id" uuid NOT NULL,
        "name" character varying NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_professors" PRIMARY KEY ("id")
      )
    `);

    // Create buildings table
    await queryRunner.query(`
      CREATE TABLE "buildings" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_buildings" PRIMARY KEY ("id")
      )
    `);

    // Create rooms table
    await queryRunner.query(`
      CREATE TABLE "rooms" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "building_id" uuid NOT NULL,
        "name" character varying NOT NULL,
        "capacity" integer,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_rooms" PRIMARY KEY ("id")
      )
    `);

    // Create subjects table
    await queryRunner.query(`
      CREATE TABLE "subjects" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "code" character varying NOT NULL,
        "name" character varying NOT NULL,
        "credits" integer NOT NULL,
        "professor_id" uuid,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_subjects" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_subjects_code" UNIQUE ("code")
      )
    `);

    // Create subject_prerequisites table
    await queryRunner.query(`
      CREATE TABLE "subject_prerequisites" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "subject_id" uuid NOT NULL,
        "prerequisite_id" uuid NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_subject_prerequisites" PRIMARY KEY ("id")
      )
    `);

    // Create classes table
    await queryRunner.query(`
      CREATE TABLE "classes" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "subject_id" uuid NOT NULL,
        "year" integer NOT NULL,
        "semester" integer NOT NULL,
        "code" character varying NOT NULL,
        "max_students" integer,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_classes" PRIMARY KEY ("id")
      )
    `);

    // Create class_schedules table
    await queryRunner.query(`
      CREATE TABLE "class_schedules" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "class_id" uuid NOT NULL,
        "room_id" uuid NOT NULL,
        "day_of_week" character varying NOT NULL,
        "start_time" character varying NOT NULL,
        "end_time" character varying NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_class_schedules" PRIMARY KEY ("id")
      )
    `);

    // Add foreign key constraints
    await queryRunner.query(`
      ALTER TABLE "professors" 
      ADD CONSTRAINT "FK_professors_department_id" 
      FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "professors" 
      ADD CONSTRAINT "FK_professors_title_id" 
      FOREIGN KEY ("title_id") REFERENCES "titles"("id") ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "rooms" 
      ADD CONSTRAINT "FK_rooms_building_id" 
      FOREIGN KEY ("building_id") REFERENCES "buildings"("id") ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "subjects" 
      ADD CONSTRAINT "FK_subjects_professor_id" 
      FOREIGN KEY ("professor_id") REFERENCES "professors"("id") ON DELETE SET NULL
    `);

    await queryRunner.query(`
      ALTER TABLE "subject_prerequisites" 
      ADD CONSTRAINT "FK_subject_prerequisites_subject_id" 
      FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "subject_prerequisites" 
      ADD CONSTRAINT "FK_subject_prerequisites_prerequisite_id" 
      FOREIGN KEY ("prerequisite_id") REFERENCES "subjects"("id") ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "classes" 
      ADD CONSTRAINT "FK_classes_subject_id" 
      FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "class_schedules" 
      ADD CONSTRAINT "FK_class_schedules_class_id" 
      FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "class_schedules" 
      ADD CONSTRAINT "FK_class_schedules_room_id" 
      FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE CASCADE
    `);

    // Add indexes for better performance
    await queryRunner.query(`
      CREATE INDEX "IDX_professors_department_id" ON "professors" ("department_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_rooms_building_id" ON "rooms" ("building_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_subjects_professor_id" ON "subjects" ("professor_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_subject_prerequisites_subject_id" ON "subject_prerequisites" ("subject_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_subject_prerequisites_prerequisite_id" ON "subject_prerequisites" ("prerequisite_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_classes_subject_id" ON "classes" ("subject_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_class_schedules_class_id" ON "class_schedules" ("class_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_class_schedules_room_id" ON "class_schedules" ("room_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_class_schedules_day_of_week" ON "class_schedules" ("day_of_week")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.query(`DROP INDEX "IDX_class_schedules_day_of_week"`);
    await queryRunner.query(`DROP INDEX "IDX_class_schedules_room_id"`);
    await queryRunner.query(`DROP INDEX "IDX_class_schedules_class_id"`);
    await queryRunner.query(`DROP INDEX "IDX_classes_subject_id"`);
    await queryRunner.query(
      `DROP INDEX "IDX_subject_prerequisites_prerequisite_id"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_subject_prerequisites_subject_id"`,
    );
    await queryRunner.query(`DROP INDEX "IDX_subjects_professor_id"`);
    await queryRunner.query(`DROP INDEX "IDX_rooms_building_id"`);
    await queryRunner.query(`DROP INDEX "IDX_professors_department_id"`);

    // Drop foreign key constraints
    await queryRunner.query(
      `ALTER TABLE "class_schedules" DROP CONSTRAINT "FK_class_schedules_room_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "class_schedules" DROP CONSTRAINT "FK_class_schedules_class_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "classes" DROP CONSTRAINT "FK_classes_subject_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "subject_prerequisites" DROP CONSTRAINT "FK_subject_prerequisites_prerequisite_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "subject_prerequisites" DROP CONSTRAINT "FK_subject_prerequisites_subject_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "subjects" DROP CONSTRAINT "FK_subjects_professor_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rooms" DROP CONSTRAINT "FK_rooms_building_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "professors" DROP CONSTRAINT "FK_professors_title_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "professors" DROP CONSTRAINT "FK_professors_department_id"`,
    );

    // Drop tables
    await queryRunner.query(`DROP TABLE "class_schedules"`);
    await queryRunner.query(`DROP TABLE "classes"`);
    await queryRunner.query(`DROP TABLE "subject_prerequisites"`);
    await queryRunner.query(`DROP TABLE "subjects"`);
    await queryRunner.query(`DROP TABLE "rooms"`);
    await queryRunner.query(`DROP TABLE "buildings"`);
    await queryRunner.query(`DROP TABLE "professors"`);
    await queryRunner.query(`DROP TABLE "titles"`);
    await queryRunner.query(`DROP TABLE "departments"`);
  }
}
