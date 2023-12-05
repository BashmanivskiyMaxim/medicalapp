export class AppointmentModel {
  id: number;
  patientId: number;
  doctorId: number;
  scheduleId: number;
  appointmentDate: Date;
  appointmentTime: string;
  reason: string;

  constructor(
    id: number,
    patientId: number,
    doctorId: number,
    scheduleId: number,
    appointmentDate: Date,
    appointmentTime: string,
    reason: string,
  ) {
    this.id = id;
    this.patientId = patientId;
    this.doctorId = doctorId;
    this.scheduleId = scheduleId;
    this.appointmentDate = appointmentDate;
    this.appointmentTime = appointmentTime;
    this.reason = reason;
  }
}
