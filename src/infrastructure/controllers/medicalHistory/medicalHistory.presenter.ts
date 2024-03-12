import { ApiProperty } from '@nestjs/swagger';

export class MedicalHistoryPresenter {
  @ApiProperty()
  id: number;
  @ApiProperty()
  patientId: number;
  @ApiProperty()
  createdDate: Date;
  @ApiProperty()
  updatedDate: Date;
  @ApiProperty()
  medicalInfo: object;

  constructor(medicalHistory: any) {
    this.id = medicalHistory.id;
    this.patientId = medicalHistory.patientId;
    this.createdDate = medicalHistory.createdDate;
    this.updatedDate = medicalHistory.updatedDate;
    this.medicalInfo = medicalHistory.medicalInfo;
  }
}
