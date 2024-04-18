export class PatientProcedureModel {
  id?: number;
  patientId?: number;
  doctorId?: number;
  procedureId?: number;
  procedureDate?: Date;
  createdDate?: Date;
  updatedDate?: Date;
  appointmentTime?: string;
  report?: object;
  rating?: number;
}
