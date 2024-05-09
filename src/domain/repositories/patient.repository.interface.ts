import { PatientModel } from '../model/patientModel';

export interface PatientRepository {
  createPatient(patient: PatientModel): Promise<any>;
  updatePatient(patient: PatientModel): Promise<any>;
  deletePatient(patientId: number): Promise<any>;
  getPatient(patientId: number): Promise<any>;
  getPatients(doctorId: number): Promise<any>;
  getPatientByAccountId(accountId: number): Promise<any>;
}
