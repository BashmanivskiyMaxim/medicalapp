import { MedicalHistoryModel } from '../model/medicalHistoryModel';

export interface MedicalHistoryRepository {
  createMedicalHistory(medicalHistory: MedicalHistoryModel): Promise<any>;
  updateMedicalHistory(
    id: number,
    medicalHistory: MedicalHistoryModel,
  ): Promise<any>;
  deleteMedicalHistory(medicalHistoryId: number): Promise<any>;
  getMedicalHistory(): Promise<any>;
  getMedicalHistoryById(medicalHistoryId: number): Promise<any>;
}
