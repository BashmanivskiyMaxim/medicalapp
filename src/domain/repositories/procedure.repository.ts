import { ProcedureModel } from '../model/procedureModel';

export interface ProcedureRepository {
  createProcedure(procedure: ProcedureModel): Promise<any>;
  updateProcedure(id: number, procedure: ProcedureModel): Promise<any>;
  deleteProcedure(procedureId: number): Promise<any>;
  getProcedure(procedureId: number): Promise<any>;
  getProcedures(): Promise<any>;
  getProcedureById(id: number): Promise<any>;
  getProcedureByDoctorId(doctorId: number): Promise<any>;
  getProcedureByProcedureName(procedureName: string): Promise<any>;
  getDoctorByProcedureId(procedureId: number): Promise<any>;
  getProceduresWithDoctors(): Promise<any>;
  findForAll(options: any): Promise<any>;
  getProceduresByDoctorId(doctorId: number): Promise<any>;
}
