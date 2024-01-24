import { ApiProperty } from '@nestjs/swagger';
import { DoctorModel } from 'src/domain/model/doctorModel';

export class DoctorPresenter {
  @ApiProperty()
  accountId: number;
  @ApiProperty()
  specialty: string;
  @ApiProperty()
  qualification: string;

  constructor(patient: DoctorModel) {
    this.accountId = patient.accountId;
    this.specialty = patient.specialty;
    this.qualification = patient.qualification;
  }
}
