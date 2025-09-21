import { Injectable, Inject } from '@nestjs/common';
import { RoomRepository } from '@domain/repositories/room.repository';

export interface RoomScheduleInfo {
  roomId: string;
  roomName: string;
  buildingName: string;
  capacity: number;
  schedules: Array<{
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    className: string;
    subjectName: string;
    professorName: string;
  }>;
  availableSlots: Array<{
    dayOfWeek: string;
    startTime: string;
    endTime: string;
  }>;
}

@Injectable()
export class GetRoomsScheduleUseCase {
  constructor(
    @Inject('RoomRepository')
    private readonly roomRepository: RoomRepository,
  ) {}

  async execute(): Promise<RoomScheduleInfo[]> {
    const roomsWithSchedules =
      await this.roomRepository.getAllRoomsWithSchedules();

    return roomsWithSchedules.map((room) => ({
      ...room,
      capacity: 0, // Will be filled by repository
      availableSlots: this.calculateAvailableSlots(room.schedules),
    }));
  }

  private calculateAvailableSlots(
    schedules: Array<{
      dayOfWeek: string;
      startTime: string;
      endTime: string;
    }>,
  ): Array<{
    dayOfWeek: string;
    startTime: string;
    endTime: string;
  }> {
    const workingHours = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00'];
    const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    const availableSlots: Array<{
      dayOfWeek: string;
      startTime: string;
      endTime: string;
    }> = [];

    daysOfWeek.forEach((day) => {
      const daySchedules = schedules.filter((s) => s.dayOfWeek === day);

      for (let i = 0; i < workingHours.length - 1; i++) {
        const startTime = workingHours[i];
        const endTime = workingHours[i + 1];

        const isOccupied = daySchedules.some((schedule) =>
          this.timeOverlaps(
            startTime,
            endTime,
            schedule.startTime,
            schedule.endTime,
          ),
        );

        if (!isOccupied) {
          availableSlots.push({
            dayOfWeek: day,
            startTime,
            endTime,
          });
        }
      }
    });

    return availableSlots;
  }

  private timeOverlaps(
    start1: string,
    end1: string,
    start2: string,
    end2: string,
  ): boolean {
    const time1Start = this.timeToMinutes(start1);
    const time1End = this.timeToMinutes(end1);
    const time2Start = this.timeToMinutes(start2);
    const time2End = this.timeToMinutes(end2);

    return time1Start < time2End && time1End > time2Start;
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }
}
