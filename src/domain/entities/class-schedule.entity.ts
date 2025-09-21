import { AbstractEntity } from './abstract.entity';

export enum DayOfWeek {
  MONDAY = 'monday',
  TUESDAY = 'tuesday',
  WEDNESDAY = 'wednesday',
  THURSDAY = 'thursday',
  FRIDAY = 'friday',
  SATURDAY = 'saturday',
  SUNDAY = 'sunday',
}

export class ClassSchedule extends AbstractEntity {
  constructor(
    public readonly id: string,
    public readonly classId: string,
    public readonly roomId: string,
    public readonly dayOfWeek: DayOfWeek,
    public readonly startTime: string,
    public readonly endTime: string,
  ) {
    super();
    this.id = id;
    this.classId = classId;
    this.roomId = roomId;
    this.dayOfWeek = dayOfWeek;
    this.startTime = startTime;
    this.endTime = endTime;
    this.insertedAt = new Date();
    this.updatedAt = new Date();
  }

  static create(
    classId: string,
    roomId: string,
    dayOfWeek: DayOfWeek,
    startTime: string,
    endTime: string,
  ): ClassSchedule {
    return new ClassSchedule(
      crypto.randomUUID(),
      classId,
      roomId,
      dayOfWeek,
      startTime,
      endTime,
    );
  }

  getDurationInHours(): number {
    const start = new Date(`2000-01-01T${this.startTime}`);
    const end = new Date(`2000-01-01T${this.endTime}`);
    return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  }
}
