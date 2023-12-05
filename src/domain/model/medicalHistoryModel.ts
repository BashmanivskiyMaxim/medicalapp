export class MedicalHistoryModel {
  id: number;
  patientId: number;
  medicalProcedureId: number;
  date: Date;

  constructor(
    id: number,
    patientId: number,
    medicalProcedureId: number,
    date: Date,
  ) {
    this.id = id;
    this.patientId = patientId;
    this.medicalProcedureId = medicalProcedureId;
    this.date = date;
  }
}
