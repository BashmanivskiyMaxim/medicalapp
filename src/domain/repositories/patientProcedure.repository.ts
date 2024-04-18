import { PatientProcedureModel } from '../model/patientProcedureModel';

export interface PatientProcedureRepository {
  createPatientProcedure(patientProcedure: PatientProcedureModel): Promise<any>;
  updatePatientProcedure(patientProcedure: PatientProcedureModel): Promise<any>;
  deletePatientProcedure(patientProcedureId: number): Promise<any>;
  getPatientProcedure(patientId: number, doctorId: number): Promise<any>;
  getPatientProcedures(patientId: number): Promise<any>;
}
