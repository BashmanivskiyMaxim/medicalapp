import { PatientModel } from '../model/patientModel';

export interface PatientRepository {
  createPatient(patient: PatientModel): Promise<any>;
  updatePatient(patient: PatientModel): Promise<any>;
  deletePatient(patient: PatientModel): Promise<any>;
  getPatient(patient: PatientModel): Promise<any>;
  getPatients(patient: PatientModel[]): Promise<any>;
}
