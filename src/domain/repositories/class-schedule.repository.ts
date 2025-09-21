import { ClassSchedule, DayOfWeek } from '../entities/class-schedule.entity';

export interface ClassScheduleRepository {
  findById(id: string): Promise<ClassSchedule | null>;
  findAll(): Promise<ClassSchedule[]>;
  findByClassId(classId: string): Promise<ClassSchedule[]>;
  findByRoomId(roomId: string): Promise<ClassSchedule[]>;
  findByDayOfWeek(dayOfWeek: DayOfWeek): Promise<ClassSchedule[]>;
  save(classSchedule: ClassSchedule): Promise<ClassSchedule>;
  delete(id: string): Promise<void>;
  findConflictingSchedules(
    roomId: string,
    dayOfWeek: DayOfWeek,
    startTime: string,
    endTime: string,
    excludeScheduleId?: string,
  ): Promise<ClassSchedule[]>;
}
