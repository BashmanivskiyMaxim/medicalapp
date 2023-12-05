export class PatientModel {
  id: number;
  accountId: number;
  doctorId: number;

  constructor(id: number, accountId: number, doctorId: number) {
    this.id = id;
    this.accountId = accountId;
    this.doctorId = doctorId;
  }
}
