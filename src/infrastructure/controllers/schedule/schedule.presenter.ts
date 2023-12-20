import { ApiProperty } from '@nestjs/swagger';
import { ScheduleModel } from 'src/domain/model/scheduleModel';

export class SchedulePresenter {
  @ApiProperty()
  id: number;
  @ApiProperty()
  dayOfWeek: string;
  @ApiProperty()
  startTime: string;
  @ApiProperty()
  endTime: string;
  @ApiProperty()
  doctorId: number;

  constructor(schedule: ScheduleModel) {
    this.id = schedule.id;
    this.dayOfWeek = schedule.dayOfWeek;
    this.startTime = schedule.startTime;
    this.endTime = schedule.endTime;
    this.doctorId = schedule.doctorId;
  }
}
