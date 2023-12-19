import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { BaseAbstractRepository } from './base/base.abstract.repository';
import { ScheduleEntity } from '../entities/schedule.entity';
import { ScheduleRepository } from '../../domain/repositories/schedule.repository.interface';
import { ScheduleModel } from 'src/domain/model/scheduleModel';

@Injectable()
export class DatabaseScheduleRepository
  extends BaseAbstractRepository<ScheduleEntity>
  implements ScheduleRepository
{
  constructor(
    @InjectRepository(ScheduleEntity)
    private readonly scheduleEntityRepository: Repository<ScheduleEntity>,
  ) {
    super(scheduleEntityRepository);
  }
  createSchedule(schedule: ScheduleModel): Promise<any> {
    const scheduleEntity = this.scheduleEntityRepository.create({
      id: schedule.id,
      dayOfWeek: schedule.dayOfWeek,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      doctorId: { id: schedule.doctorId },
    });
    return this.scheduleEntityRepository.save(scheduleEntity);
  }
  updateSchedule(schedule: ScheduleModel): Promise<any> {
    return this.scheduleEntityRepository.update(schedule.id, {
      id: schedule.id,
      dayOfWeek: schedule.dayOfWeek,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      doctorId: { id: schedule.doctorId },
    });
  }
  deleteSchedule(schedule: ScheduleModel): Promise<any> {
    return this.scheduleEntityRepository.delete(schedule.id);
  }
  getSchedule(schedule: ScheduleModel): Promise<any> {
    return this.scheduleEntityRepository.findOne({
      where: { id: schedule.id },
    });
  }
}
