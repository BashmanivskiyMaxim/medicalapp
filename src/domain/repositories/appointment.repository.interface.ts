import { BaseInterfaceRepository } from '@app/shared';
import { AppointmentEntity } from '../entities/appointment.entity';

export interface AppointmentRepositoryInterface
  extends BaseInterfaceRepository<AppointmentEntity> {
  findAppointment(
    userId: number,
    friendId: number,
  ): Promise<AppointmentEntity | undefined>;
}
