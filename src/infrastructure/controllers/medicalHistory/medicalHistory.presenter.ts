import { ApiProperty } from '@nestjs/swagger';
import { MedicalHistoryModel } from 'src/domain/model/medicalHistoryModel';

export class MedicalHistoryPresenter {
  @ApiProperty()
  id: number;
  @ApiProperty()
  patientId: number;
  @ApiProperty()
  medicalProcedureId: number;
  @ApiProperty()
  createdDate: Date;

  constructor(medicalHistory: MedicalHistoryModel) {
    this.id = medicalHistory.id;
    this.patientId = medicalHistory.patientId;
    this.medicalProcedureId = medicalHistory.medicalProcedureId;
    this.createdDate = medicalHistory.createdDate;
  }
}
