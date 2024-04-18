import { PatientProcedureModel } from './patientProcedureModel';

export class PatientModel {
  id?: number;
  accountId?: number;
  doctorId?: number;
  recovery_status?: boolean;
  additional_info?: object;
  procedures?: PatientProcedureModel[];
}
