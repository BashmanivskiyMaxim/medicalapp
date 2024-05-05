import { DoctorModel } from '../model/doctorModel';

export interface DoctorRepository {
  createDoctor(doctor: any): Promise<any>;
  updateDoctor(id: number, doctor: DoctorModel): Promise<any>;
  deleteDoctor(doctorAccountId: number): Promise<any>;
  getDoctor(doctor: DoctorModel): Promise<any>;
  getDoctors(): Promise<any>;
  findByAccountId(accountId: number): Promise<any>;
  findByUsername(username: string): Promise<any>;
}
