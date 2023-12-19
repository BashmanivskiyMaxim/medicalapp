import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseAbstractRepository } from './base/base.abstract.repository';
import { AppointmentEntity } from '../entities/appointment.entity';
import { AppointmentRepository } from '../../domain/repositories/appointment.repository.interface';
import { AppointmentModel } from 'src/domain/model/appointmentModel';

@Injectable()
export class DatabaseAppointmentRepository
  extends BaseAbstractRepository<AppointmentEntity>
  implements AppointmentRepository
{
  constructor(
    @InjectRepository(AppointmentEntity)
    private readonly appointmentEntityRepository: Repository<AppointmentEntity>,
  ) {
    super(appointmentEntityRepository);
  }
  createAppointment(appointment: any): Promise<any> {
    const appointmentEntity =
      this.appointmentEntityRepository.create(appointment);
    return this.appointmentEntityRepository.save(appointmentEntity);
  }
  updateAppointment(appointment: any): Promise<any> {
    return this.appointmentEntityRepository.update(appointment.id, appointment);
  }
  deleteAppointment(appointment: any): Promise<any> {
    return this.appointmentEntityRepository.delete(appointment.id);
  }
  getAppointment(appointment: AppointmentModel): Promise<any> {
    return this.appointmentEntityRepository.findOne({
      where: { id: appointment.id },
    });
  }
}
