export class ProcedureModel {
  id?: number;
  doctorId?: number;
  procedureName?: string;
  procedureDescription?: string;
  averageRating?: number;
}

export class ProcedureModelWithDoctor extends ProcedureModel {
  doctorUsername?: string;
}
