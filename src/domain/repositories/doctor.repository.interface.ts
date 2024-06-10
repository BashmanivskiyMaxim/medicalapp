import { DoctorModel } from '../model/doctorModel';

export interface DoctorRepository {
  createDoctor(doctor: any): Promise<any>;
  updateDoctor(id: number, doctor: DoctorModel): Promise<any>;
  getDoctor(doctor: DoctorModel): Promise<any>;
  getDoctors(): Promise<any>;
  findByAccountId(accountId: number): Promise<any>;
  findByUsername(username: string): Promise<any>;
  getDoctorById(doctorId: number): Promise<any>;
  getDoctorsByIds(ids: number[]): Promise<DoctorModel[]>;
  findByPatientProcedureId(patientProcedureId: number): Promise<any>;
  getDoctorByAccountId(accountId: number): Promise<any>;
  deleteDoctor(doctorId: number): Promise<any>;
  findAllDoctorsByAccountId(accountId: number): Promise<any>;
}
