import { DoctorModel } from '../model/doctorModel';

export interface DoctorRepository {
  createDoctor(doctor: any): Promise<any>;
  updateDoctor(doctor: DoctorModel): Promise<any>;
  deleteDoctor(doctor: DoctorModel): Promise<any>;
  getDoctor(doctor: DoctorModel): Promise<any>;
  getDoctors(doctor: DoctorModel[]): Promise<any>;
}
