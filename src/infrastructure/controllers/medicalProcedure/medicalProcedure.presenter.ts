import { ApiProperty } from '@nestjs/swagger';
import { MedicalProcedureModel } from 'src/domain/model/medicalProcedureModel';

export class MedicalProcedurePresenter {
  @ApiProperty()
  id: number;
  @ApiProperty()
  procedureType: string;
  @ApiProperty()
  description: string;

  constructor(medicalProcedure: MedicalProcedureModel) {
    this.id = medicalProcedure.id;
    this.procedureType = medicalProcedure.procedureType;
    this.description = medicalProcedure.description;
  }
}
