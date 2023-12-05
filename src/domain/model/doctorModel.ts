import { PatientModel } from './patientModel';

export class DoctorModel {
  id: number;
  accountId: number;
  specialty: string;
  qualification: string;
  patients: PatientModel[];

  constructor(
    id: number,
    accountId: number,
    specialty: string,
    qualification: string,
    patients: PatientModel[],
  ) {
    this.id = id;
    this.accountId = accountId;
    this.specialty = specialty;
    this.qualification = qualification;
    this.patients = patients;
  }
}
