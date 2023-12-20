import { ILogger } from 'src/domain/logger/logger.interface';
import { ScheduleModel } from 'src/domain/model/scheduleModel';
import { ScheduleRepository } from 'src/domain/repositories/schedule.repository.interface';

export class addScheduleUseCases {
  constructor(
    private readonly logger: ILogger,
    private readonly scheduleRepository: ScheduleRepository,
  ) {}
  async execute(data: ScheduleModel): Promise<ScheduleModel> {
    const schedule = new ScheduleModel();
    schedule.id = data.id;
    schedule.doctorId = data.doctorId;
    schedule.dayOfWeek = data.dayOfWeek;
    schedule.startTime = data.startTime;
    schedule.endTime = data.endTime;
    const result = await this.scheduleRepository.createSchedule(schedule);
    this.logger.log('addSchedule execute', 'New schedule have been inserted');
    return result;
  }
}
