import { ApiProperty } from '@nestjs/swagger';
import { DoctorModel } from 'src/domain/model/doctorModel';

export class ProcedurePresenter {
  @ApiProperty()
  doctor: DoctorModel;
  @ApiProperty()
  procedureName: string;
  @ApiProperty()
  procedureDescription: string;
  @ApiProperty()
  averageRating: number;

  constructor(procedure: any) {
    this.doctor = procedure.doctor;
    this.procedureName = procedure.procedureName;
    this.procedureDescription = procedure.procedureDescription;
    this.averageRating = procedure.averageRating;
  }
}
