import { MedicalHistoryModel } from '../model/medicalHistoryModel';

export interface MedicalHistoryRepository {
  createMedicalHistory(medicalHistory: MedicalHistoryModel): Promise<any>;
  updateMedicalHistory(medicalHistory: MedicalHistoryModel): Promise<any>;
  deleteMedicalHistory(medicalHistory: MedicalHistoryModel): Promise<any>;
}
