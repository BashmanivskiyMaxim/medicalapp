export class MedicalProcedureModel {
  id: number;
  procedureType: string;
  description: string;

  constructor(id: number, procedureType: string, description: string) {
    this.id = id;
    this.procedureType = procedureType;
    this.description = description;
  }
}
