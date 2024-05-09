import { ApiProperty } from '@nestjs/swagger';
import { PatientModel } from 'src/domain/model/patientModel';

export class PatientPresenter {
  @ApiProperty()
  id: number;
  @ApiProperty()
  accountId: number;
  @ApiProperty()
  doctorId: number;
  @ApiProperty()
  recovery_status: boolean;
  @ApiProperty()
  additional_info: object | string;

  constructor(patient: PatientModel) {
    this.id = patient.id;
    this.accountId = patient.accountId;
    this.recovery_status = patient.recovery_status;
    this.additional_info = patient.additional_info;
  }
}
