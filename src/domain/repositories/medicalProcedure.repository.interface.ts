import { MedicalProcedureModel } from '../model/medicalProcedureModel';

export interface MedicalProcedureRepository {
  createMedicalProcedure(medicalProcedure: MedicalProcedureModel): Promise<any>;
  updateMedicalProcedure(medicalProcedure: MedicalProcedureModel): Promise<any>;
  deleteMedicalProcedure(medicalProcedure: MedicalProcedureModel): Promise<any>;
}
