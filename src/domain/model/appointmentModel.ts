export class AppointmentModel {
  id: number;
  patientId: number;
  doctorId: number;
  scheduleId: number;
  appointmentDate: Date;
  appointmentTime: string;
  reason: string;
}
