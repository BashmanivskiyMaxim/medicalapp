import { ApiProperty } from '@nestjs/swagger';
import { AppointmentModel } from 'src/domain/model/appointmentModel';

export class AppointmentPresenter {
  @ApiProperty()
  id: number;
  @ApiProperty()
  patientId: number;
  @ApiProperty()
  doctorId: number;
  @ApiProperty()
  scheduleId: number;
  @ApiProperty()
  appointmentDate: Date;
  @ApiProperty()
  appointmentTime: string;
  @ApiProperty()
  reason: string;

  constructor(patient: AppointmentModel) {
    this.id = patient.id;
    this.patientId = patient.patientId;
    this.doctorId = patient.doctorId;
    this.scheduleId = patient.scheduleId;
    this.appointmentDate = patient.appointmentDate;
    this.appointmentTime = patient.appointmentTime;
    this.reason = patient.reason;
  }
}
