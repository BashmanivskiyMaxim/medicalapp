import { ProcedureModel } from '../model/procedureModel';

export interface ProcedureRepository {
  createProcedure(procedure: ProcedureModel): Promise<any>;
  updateProcedure(id: number, procedure: ProcedureModel): Promise<any>;
  deleteProcedure(procedureId: number): Promise<any>;
  getProcedure(procedureId: number): Promise<any>;
  getProcedures(): Promise<any>;
}
