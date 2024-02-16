export class MedicalHistoryModel {
  id: number;
  patientId: number;
  medicalProcedureId?: number;
  medicalInfo?: any;
  createdDate?: Date;
  updatedDate?: Date;
}
