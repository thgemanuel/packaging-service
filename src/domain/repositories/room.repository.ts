import { Room } from '../entities/room.entity';

export interface RoomRepository {
  findById(id: string): Promise<Room | null>;
  findAll(): Promise<Room[]>;
  findByBuildingId(buildingId: string): Promise<Room[]>;
  save(room: Room): Promise<Room>;
  delete(id: string): Promise<void>;
  getRoomSchedule(roomId: string): Promise<
    Array<{
      dayOfWeek: string;
      startTime: string;
      endTime: string;
      className: string;
      subjectName: string;
      professorName: string;
    }>
  >;
  getAllRoomsWithSchedules(): Promise<
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
  >;
}
