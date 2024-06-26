import { DoctorModel } from './doctorModel';

export class ProcedureModel {
  id?: number;
  doctorId?: number;
  procedureName?: string;
  procedureDescription?: string;
  averageRating?: number;
  deleted?: boolean;
}

export class ProcedureModelWithDoctorUsername extends ProcedureModel {
  doctorUsername: string;
}

export class ProcedureModelWithDoctor extends ProcedureModel {
  doctor: DoctorModel;
}
