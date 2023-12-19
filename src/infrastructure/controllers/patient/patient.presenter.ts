import { ApiProperty } from '@nestjs/swagger';
import { PatientModel } from 'src/domain/model/patientModel';

export class PatientPresenter {
  @ApiProperty()
  id: number;
  @ApiProperty()
  accountId: number;
  @ApiProperty()
  doctorId: number;

  constructor(patient: PatientModel) {
    this.id = patient.id;
    this.accountId = patient.accountId;
    this.doctorId = patient.doctorId;
  }
}
