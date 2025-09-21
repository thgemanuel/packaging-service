import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  GetProfessorsTeachingHoursUseCase,
  ProfessorTeachingHours,
} from '@application/use-cases/get-professors-teaching-hours.use-case';
import {
  GetRoomsScheduleUseCase,
  RoomScheduleInfo,
} from '@application/use-cases/get-rooms-schedule.use-case';

@ApiTags('Educational System')
@Controller('educational-system')
export class EducationalSystemController {
  constructor(
    private readonly getProfessorsTeachingHoursUseCase: GetProfessorsTeachingHoursUseCase,
    private readonly getRoomsScheduleUseCase: GetRoomsScheduleUseCase,
  ) {}

  @Get('professors/teaching-hours')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get professors teaching hours',
    description: 'Returns the total teaching hours for each professor',
  })
  @ApiResponse({
    status: 200,
    description: 'List of professors with their teaching hours',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          professorId: { type: 'string' },
          professorName: { type: 'string' },
          departmentName: { type: 'string' },
          titleName: { type: 'string' },
          totalHours: { type: 'number' },
        },
      },
    },
  })
  async getProfessorsTeachingHours(): Promise<ProfessorTeachingHours[]> {
    return this.getProfessorsTeachingHoursUseCase.execute();
  }

  @Get('rooms/schedule')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get rooms schedule',
    description:
      'Returns all rooms with their occupied and available time slots',
  })
  @ApiResponse({
    status: 200,
    description: 'List of rooms with their schedules and available slots',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          roomId: { type: 'string' },
          roomName: { type: 'string' },
          buildingName: { type: 'string' },
          capacity: { type: 'number' },
          schedules: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                dayOfWeek: { type: 'string' },
                startTime: { type: 'string' },
                endTime: { type: 'string' },
                className: { type: 'string' },
                subjectName: { type: 'string' },
                professorName: { type: 'string' },
              },
            },
          },
          availableSlots: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                dayOfWeek: { type: 'string' },
                startTime: { type: 'string' },
                endTime: { type: 'string' },
              },
            },
          },
        },
      },
    },
  })
  async getRoomsSchedule(): Promise<RoomScheduleInfo[]> {
    return this.getRoomsScheduleUseCase.execute();
  }
}
