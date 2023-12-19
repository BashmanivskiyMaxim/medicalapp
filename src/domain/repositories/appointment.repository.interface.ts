import { AppointmentModel } from '../model/appointmentModel';

export interface AppointmentRepository {
  createAppointment(appointment: any): Promise<any>;
  updateAppointment(appointment: any): Promise<any>;
  deleteAppointment(appointment: any): Promise<any>;
  getAppointment(appointment: AppointmentModel): Promise<any>;
}
