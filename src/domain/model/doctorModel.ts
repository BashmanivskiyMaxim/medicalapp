import { PatientModel } from './patientModel';

export class DoctorModel {
  id: number;
  accountId: number;
  specialty: string;
  qualification: string;
  patients: PatientModel[];
}
