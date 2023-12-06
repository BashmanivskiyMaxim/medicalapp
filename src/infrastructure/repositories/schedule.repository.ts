import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { BaseAbstractRepository } from './base/base.abstract.repository';
import { ScheduleEntity } from '../entities/schedule.entity';
import { ScheduleRepositoryInterface } from '../../domain/repositories/schedule.repository.interface';

@Injectable()
export class ScheduleRepository
  extends BaseAbstractRepository<ScheduleEntity>
  implements ScheduleRepositoryInterface
{
  constructor(
    @InjectRepository(ScheduleEntity)
    private readonly scheduleEntity: Repository<ScheduleEntity>,
  ) {
    super(scheduleEntity);
  }

  public async findschedule(): Promise<ScheduleEntity | undefined> {
    return await this.scheduleEntity.findOne({});
  }
}
