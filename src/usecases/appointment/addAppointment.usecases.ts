import { ILogger } from 'src/domain/logger/logger.interface';
import { AppointmentRepository } from 'src/domain/repositories/appointment.repository.interface';
import { AppointmentModel } from '../../domain/model/appointmentModel';

export class addAppointmentUseCases {
  constructor(
    private readonly logger: ILogger,
    private readonly appointmentRepository: AppointmentRepository,
  ) {}
  async execute(data: AppointmentModel): Promise<AppointmentModel> {
    const appointment = new AppointmentModel();
    appointment.id = data.id;
    appointment.patientId = data.patientId;
    appointment.doctorId = data.doctorId;
    appointment.scheduleId = data.scheduleId;
    appointment.appointmentDate = data.appointmentDate;
    appointment.appointmentTime = data.appointmentTime;
    appointment.reason = data.reason;
    const result =
      await this.appointmentRepository.createAppointment(appointment);
    this.logger.log(
      'addAppintmentUseCases execute',
      'New apointment have been inserted',
    );
    return result;
  }
}
