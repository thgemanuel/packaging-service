import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedEducationalSystemData1758402848562
  implements MigrationInterface
{
  name = 'SeedEducationalSystemData1758402848562';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Insert departments
    await queryRunner.query(`
      INSERT INTO "departments" ("id", "name") VALUES
      ('550e8400-e29b-41d4-a716-446655440001', 'Matemática'),
      ('550e8400-e29b-41d4-a716-446655440002', 'Física'),
      ('550e8400-e29b-41d4-a716-446655440003', 'Química'),
      ('550e8400-e29b-41d4-a716-446655440004', 'Biologia'),
      ('550e8400-e29b-41d4-a716-446655440005', 'História')
    `);

    // Insert titles
    await queryRunner.query(`
      INSERT INTO "titles" ("id", "name") VALUES
      ('650e8400-e29b-41d4-a716-446655440001', 'Professor Doutor'),
      ('650e8400-e29b-41d4-a716-446655440002', 'Professor Mestre'),
      ('650e8400-e29b-41d4-a716-446655440003', 'Professor Especialista'),
      ('650e8400-e29b-41d4-a716-446655440004', 'Professor Diretor')
    `);

    // Insert buildings
    await queryRunner.query(`
      INSERT INTO "buildings" ("id", "name") VALUES
      ('750e8400-e29b-41d4-a716-446655440001', 'Prédio A - Matemática'),
      ('750e8400-e29b-41d4-a716-446655440002', 'Prédio B - Ciências'),
      ('750e8400-e29b-41d4-a716-446655440003', 'Prédio C - Humanas'),
      ('750e8400-e29b-41d4-a716-446655440004', 'Prédio D - Laboratórios')
    `);

    // Insert professors
    await queryRunner.query(`
      INSERT INTO "professors" ("id", "department_id", "title_id", "name") VALUES
      ('850e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440004', 'Professor Girafales'),
      ('850e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440001', 'Professor Newton'),
      ('850e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440001', 'Professor Einstein'),
      ('850e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440004', '650e8400-e29b-41d4-a716-446655440002', 'Professor Darwin'),
      ('850e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440005', '650e8400-e29b-41d4-a716-446655440002', 'Professor Heródoto')
    `);

    // Insert rooms
    await queryRunner.query(`
      INSERT INTO "rooms" ("id", "building_id", "name", "capacity") VALUES
      ('950e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440001', 'Sala 101', 30),
      ('950e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440001', 'Sala 102', 25),
      ('950e8400-e29b-41d4-a716-446655440003', '750e8400-e29b-41d4-a716-446655440002', 'Laboratório 201', 20),
      ('950e8400-e29b-41d4-a716-446655440004', '750e8400-e29b-41d4-a716-446655440002', 'Laboratório 202', 15),
      ('950e8400-e29b-41d4-a716-446655440005', '750e8400-e29b-41d4-a716-446655440003', 'Sala 301', 35),
      ('950e8400-e29b-41d4-a716-446655440006', '750e8400-e29b-41d4-a716-446655440003', 'Sala 302', 30),
      ('950e8400-e29b-41d4-a716-446655440007', '750e8400-e29b-41d4-a716-446655440004', 'Laboratório 401', 12),
      ('950e8400-e29b-41d4-a716-446655440008', '750e8400-e29b-41d4-a716-446655440004', 'Laboratório 402', 18)
    `);

    // Insert subjects
    await queryRunner.query(`
      INSERT INTO "subjects" ("id", "code", "name", "credits", "professor_id") VALUES
      ('a50e8400-e29b-41d4-a716-446655440001', 'MAT101', 'Álgebra Linear', 4, '850e8400-e29b-41d4-a716-446655440001'),
      ('a50e8400-e29b-41d4-a716-446655440002', 'MAT102', 'Cálculo I', 4, '850e8400-e29b-41d4-a716-446655440001'),
      ('a50e8400-e29b-41d4-a716-446655440003', 'FIS101', 'Física I', 4, '850e8400-e29b-41d4-a716-446655440002'),
      ('a50e8400-e29b-41d4-a716-446655440004', 'FIS102', 'Física II', 4, '850e8400-e29b-41d4-a716-446655440002'),
      ('a50e8400-e29b-41d4-a716-446655440005', 'QUI101', 'Química Geral', 4, '850e8400-e29b-41d4-a716-446655440003'),
      ('a50e8400-e29b-41d4-a716-446655440006', 'BIO101', 'Biologia Geral', 4, '850e8400-e29b-41d4-a716-446655440004'),
      ('a50e8400-e29b-41d4-a716-446655440007', 'HIS101', 'História Antiga', 3, '850e8400-e29b-41d4-a716-446655440005'),
      ('a50e8400-e29b-41d4-a716-446655440008', 'HIS102', 'História Medieval', 3, '850e8400-e29b-41d4-a716-446655440005')
    `);

    // Insert classes
    await queryRunner.query(`
      INSERT INTO "classes" ("id", "subject_id", "year", "semester", "code", "max_students") VALUES
      ('b50e8400-e29b-41d4-a716-446655440001', 'a50e8400-e29b-41d4-a716-446655440001', 2024, 1, 'MAT101-2024-1', 30),
      ('b50e8400-e29b-41d4-a716-446655440002', 'a50e8400-e29b-41d4-a716-446655440002', 2024, 1, 'MAT102-2024-1', 25),
      ('b50e8400-e29b-41d4-a716-446655440003', 'a50e8400-e29b-41d4-a716-446655440003', 2024, 1, 'FIS101-2024-1', 20),
      ('b50e8400-e29b-41d4-a716-446655440004', 'a50e8400-e29b-41d4-a716-446655440004', 2024, 1, 'FIS102-2024-1', 20),
      ('b50e8400-e29b-41d4-a716-446655440005', 'a50e8400-e29b-41d4-a716-446655440005', 2024, 1, 'QUI101-2024-1', 15),
      ('b50e8400-e29b-41d4-a716-446655440006', 'a50e8400-e29b-41d4-a716-446655440006', 2024, 1, 'BIO101-2024-1', 18),
      ('b50e8400-e29b-41d4-a716-446655440007', 'a50e8400-e29b-41d4-a716-446655440007', 2024, 1, 'HIS101-2024-1', 35),
      ('b50e8400-e29b-41d4-a716-446655440008', 'a50e8400-e29b-41d4-a716-446655440008', 2024, 1, 'HIS102-2024-1', 30)
    `);

    // Insert class schedules
    await queryRunner.query(`
      INSERT INTO "class_schedules" ("id", "class_id", "room_id", "day_of_week", "start_time", "end_time") VALUES
      ('c50e8400-e29b-41d4-a716-446655440001', 'b50e8400-e29b-41d4-a716-446655440001', '950e8400-e29b-41d4-a716-446655440001', 'monday', '08:00', '10:00'),
      ('c50e8400-e29b-41d4-a716-446655440002', 'b50e8400-e29b-41d4-a716-446655440001', '950e8400-e29b-41d4-a716-446655440001', 'wednesday', '08:00', '10:00'),
      ('c50e8400-e29b-41d4-a716-446655440003', 'b50e8400-e29b-41d4-a716-446655440002', '950e8400-e29b-41d4-a716-446655440002', 'tuesday', '10:00', '12:00'),
      ('c50e8400-e29b-41d4-a716-446655440004', 'b50e8400-e29b-41d4-a716-446655440002', '950e8400-e29b-41d4-a716-446655440002', 'thursday', '10:00', '12:00'),
      ('c50e8400-e29b-41d4-a716-446655440005', 'b50e8400-e29b-41d4-a716-446655440003', '950e8400-e29b-41d4-a716-446655440003', 'monday', '14:00', '16:00'),
      ('c50e8400-e29b-41d4-a716-446655440006', 'b50e8400-e29b-41d4-a716-446655440003', '950e8400-e29b-41d4-a716-446655440003', 'friday', '14:00', '16:00'),
      ('c50e8400-e29b-41d4-a716-446655440007', 'b50e8400-e29b-41d4-a716-446655440004', '950e8400-e29b-41d4-a716-446655440004', 'tuesday', '16:00', '18:00'),
      ('c50e8400-e29b-41d4-a716-446655440008', 'b50e8400-e29b-41d4-a716-446655440004', '950e8400-e29b-41d4-a716-446655440004', 'thursday', '16:00', '18:00'),
      ('c50e8400-e29b-41d4-a716-446655440009', 'b50e8400-e29b-41d4-a716-446655440005', '950e8400-e29b-41d4-a716-446655440007', 'wednesday', '08:00', '10:00'),
      ('c50e8400-e29b-41d4-a716-446655440010', 'b50e8400-e29b-41d4-a716-446655440005', '950e8400-e29b-41d4-a716-446655440007', 'friday', '08:00', '10:00'),
      ('c50e8400-e29b-41d4-a716-446655440011', 'b50e8400-e29b-41d4-a716-446655440006', '950e8400-e29b-41d4-a716-446655440008', 'monday', '10:00', '12:00'),
      ('c50e8400-e29b-41d4-a716-446655440012', 'b50e8400-e29b-41d4-a716-446655440006', '950e8400-e29b-41d4-a716-446655440008', 'wednesday', '10:00', '12:00'),
      ('c50e8400-e29b-41d4-a716-446655440013', 'b50e8400-e29b-41d4-a716-446655440007', '950e8400-e29b-41d4-a716-446655440005', 'tuesday', '14:00', '16:00'),
      ('c50e8400-e29b-41d4-a716-446655440014', 'b50e8400-e29b-41d4-a716-446655440007', '950e8400-e29b-41d4-a716-446655440005', 'thursday', '14:00', '16:00'),
      ('c50e8400-e29b-41d4-a716-446655440015', 'b50e8400-e29b-41d4-a716-446655440008', '950e8400-e29b-41d4-a716-446655440006', 'friday', '10:00', '12:00')
    `);

    // Insert subject prerequisites
    await queryRunner.query(`
      INSERT INTO "subject_prerequisites" ("id", "subject_id", "prerequisite_id") VALUES
      ('d50e8400-e29b-41d4-a716-446655440001', 'a50e8400-e29b-41d4-a716-446655440002', 'a50e8400-e29b-41d4-a716-446655440001'),
      ('d50e8400-e29b-41d4-a716-446655440002', 'a50e8400-e29b-41d4-a716-446655440004', 'a50e8400-e29b-41d4-a716-446655440003'),
      ('d50e8400-e29b-41d4-a716-446655440003', 'a50e8400-e29b-41d4-a716-446655440008', 'a50e8400-e29b-41d4-a716-446655440007')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "subject_prerequisites"`);
    await queryRunner.query(`DELETE FROM "class_schedules"`);
    await queryRunner.query(`DELETE FROM "classes"`);
    await queryRunner.query(`DELETE FROM "subjects"`);
    await queryRunner.query(`DELETE FROM "rooms"`);
    await queryRunner.query(`DELETE FROM "professors"`);
    await queryRunner.query(`DELETE FROM "buildings"`);
    await queryRunner.query(`DELETE FROM "titles"`);
    await queryRunner.query(`DELETE FROM "departments"`);
  }
}
