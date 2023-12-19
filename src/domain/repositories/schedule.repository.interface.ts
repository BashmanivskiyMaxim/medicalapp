import { ScheduleModel } from '../model/scheduleModel';

export interface ScheduleRepository {
  createSchedule(schedule: ScheduleModel): Promise<any>;
  updateSchedule(schedule: ScheduleModel): Promise<any>;
  deleteSchedule(schedule: ScheduleModel): Promise<any>;
  getSchedule(schedule: ScheduleModel): Promise<any>;
}
