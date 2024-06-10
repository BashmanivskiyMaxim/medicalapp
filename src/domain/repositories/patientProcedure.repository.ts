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
  getPatientProceduresTimesByDate(
    date: string,
    procedureId: number,
  ): Promise<any>;
  deleteSchedule(startOfDay: Date, endOfDay: Date): Promise<void>;
  getExistenseProcedure(
    procedure: any,
    procedureDate: Date,
    appointmentTime: string,
  ): Promise<any>;
  getAvailableProceduresByDay(today: string): Promise<any>;
  getUserPreferences(patientId: number): Promise<any>;
  getProceduresByDoctorAndTime(
    doctorId: number,
    appointmentTime: string,
    procedureDate: string,
  ): Promise<any>;
  getInactiveProceduresByDoctorAndTime(
    doctorId: number,
    appointmentTime: string,
    procedureDate: string,
  ): Promise<any>;
  getExistenseProcTodayByPatientId(
    patientId: number,
    procedureDate: string,
    //procedureId: number,
  ): Promise<any>;
  getTodayProceduresByDoctorId(
    doctorId: number,
    page: number,
    pageSize: number,
  ): Promise<any>;
  getFutureProceduresByDoctorId(
    doctorId: number,
    page: number,
    pageSize: number,
  ): Promise<any>;
  getPastProceduresByDoctorId(
    doctorId: number,
    page: number,
    pageSize: number,
  ): Promise<any>;
  searchProceduresByKeyWord(
    keyword: string,
    id: number,
    accountType: string,
  ): Promise<any>;
  getTodayPatientProcedures(patientId: number): Promise<any>;
}
