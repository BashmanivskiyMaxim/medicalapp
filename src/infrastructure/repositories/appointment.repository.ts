import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { BaseAbstractRepository } from './base/base.abstract.repository';
import { AppointmentEntity } from '../entities/appointment.entity';
import { AppointmentRepositoryInterface } from '../../domain/repositories/appointment.repository.interface';

@Injectable()
export class AppointmentRepository
  extends BaseAbstractRepository<AppointmentEntity>
  implements AppointmentRepositoryInterface
{
  constructor(
    @InjectRepository(AppointmentEntity)
    private readonly appointmentEntity: Repository<AppointmentEntity>,
  ) {
    super(appointmentEntity);
  }

  public async findAppointment(): Promise<AppointmentEntity | undefined> {
    return await this.appointmentEntity.findOne({});
  }
}
