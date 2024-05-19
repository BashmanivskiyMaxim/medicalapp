import { PatientProcedureModel } from '../model/patientProcedureModel';

export interface PatientProcedureRepository {
  createPatientProcedure(patientProcedure: PatientProcedureModel): Promise<any>;
  updatePatientProcedure(
    id: number,
    patientProcedure: PatientProcedureModel,
  ): Promise<any>;
  deletePatientProcedure(patientProcedureId: number): Promise<any>;
  getPatientProcedure(patientId: number, doctorId: number): Promise<any>;
  getPatientProcedures(patientId: number): Promise<any>;
  getPatientProcedureById(patientProcedureId: number): Promise<any>;
  getAllProcedures(): Promise<any>;
  getPatientProceduresByProcedureId(procedureId: number): Promise<any>;
  getPatientProceduresByDoctorId(doctorId: number): Promise<any>;
  getPatientProceduresTimesTodayById(
    date: Date,
    patientId: number,
  ): Promise<any>;
  getExistenseProcTodayByPatientId(
    patientId: number,
    procedureId: number,
  ): Promise<any>;
}
