import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomRepository } from '@domain/repositories/room.repository';
import { Room } from '@domain/entities/room.entity';
import { RoomSchema } from '../schemas/room.schema';

@Injectable()
export class PostgresRoomRepository implements RoomRepository {
  constructor(
    @InjectRepository(RoomSchema)
    private readonly repository: Repository<RoomSchema>,
  ) {}

  async findById(id: string): Promise<Room | null> {
    const schema = await this.repository.findOne({
      where: { id },
      relations: ['building'],
    });

    if (!schema) return null;

    return new Room(schema.id, schema.buildingId, schema.name, schema.capacity);
  }

  async findAll(): Promise<Room[]> {
    const schemas = await this.repository.find({
      relations: ['building'],
    });

    return schemas.map(
      (schema) =>
        new Room(schema.id, schema.buildingId, schema.name, schema.capacity),
    );
  }

  async findByBuildingId(buildingId: string): Promise<Room[]> {
    const schemas = await this.repository.find({
      where: { buildingId },
      relations: ['building'],
    });

    return schemas.map(
      (schema) =>
        new Room(schema.id, schema.buildingId, schema.name, schema.capacity),
    );
  }

  async save(room: Room): Promise<Room> {
    const schema = new RoomSchema();
    schema.id = room.id;
    schema.buildingId = room.buildingId;
    schema.name = room.name;
    schema.capacity = room.capacity;
    schema.createdAt = room.insertedAt;
    schema.updatedAt = room.updatedAt;

    const savedSchema = await this.repository.save(schema);
    return new Room(
      savedSchema.id,
      savedSchema.buildingId,
      savedSchema.name,
      savedSchema.capacity,
    );
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async getRoomSchedule(roomId: string): Promise<
    Array<{
      dayOfWeek: string;
      startTime: string;
      endTime: string;
      className: string;
      subjectName: string;
      professorName: string;
    }>
  > {
    const result = await this.repository.query(
      `
      SELECT 
        cs.day_of_week,
        cs.start_time,
        cs.end_time,
        c.code as class_name,
        s.name as subject_name,
        p.name as professor_name
      FROM class_schedules cs
      JOIN classes c ON cs.class_id = c.id
      JOIN subjects s ON c.subject_id = s.id
      LEFT JOIN professors p ON s.professor_id = p.id
      WHERE cs.room_id = $1
      ORDER BY cs.day_of_week, cs.start_time
    `,
      [roomId],
    );

    return result.map((row: any) => ({
      dayOfWeek: row.day_of_week,
      startTime: row.start_time,
      endTime: row.end_time,
      className: row.class_name,
      subjectName: row.subject_name,
      professorName: row.professor_name || 'Não atribuído',
    }));
  }

  async getAllRoomsWithSchedules(): Promise<
    Array<{
      roomId: string;
      roomName: string;
      buildingName: string;
      schedules: Array<{
        dayOfWeek: string;
        startTime: string;
        endTime: string;
        className: string;
        subjectName: string;
        professorName: string;
      }>;
    }>
  > {
    const result = await this.repository.query(`
      SELECT 
        r.id as room_id,
        r.name as room_name,
        r.capacity,
        b.name as building_name,
        cs.day_of_week,
        cs.start_time,
        cs.end_time,
        c.code as class_name,
        s.name as subject_name,
        p.name as professor_name
      FROM rooms r
      JOIN buildings b ON r.building_id = b.id
      LEFT JOIN class_schedules cs ON cs.room_id = r.id
      LEFT JOIN classes c ON cs.class_id = c.id
      LEFT JOIN subjects s ON c.subject_id = s.id
      LEFT JOIN professors p ON s.professor_id = p.id
      ORDER BY r.name, cs.day_of_week, cs.start_time
    `);

    const roomsMap = new Map();

    result.forEach((row: any) => {
      if (!roomsMap.has(row.room_id)) {
        roomsMap.set(row.room_id, {
          roomId: row.room_id,
          roomName: row.room_name,
          buildingName: row.building_name,
          capacity: row.capacity,
          schedules: [],
        });
      }

      if (row.day_of_week) {
        roomsMap.get(row.room_id).schedules.push({
          dayOfWeek: row.day_of_week,
          startTime: row.start_time,
          endTime: row.end_time,
          className: row.class_name,
          subjectName: row.subject_name,
          professorName: row.professor_name || 'Não atribuído',
        });
      }
    });

    return Array.from(roomsMap.values());
  }
}
