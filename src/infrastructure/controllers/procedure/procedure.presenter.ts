import { ApiProperty } from '@nestjs/swagger';

export class ProcedurePresenter {
  @ApiProperty()
  doctorId: number;
  @ApiProperty()
  procedureName: string;
  @ApiProperty()
  procedureDescription: string;
  @ApiProperty()
  averageRating: number;

  constructor(procedure: any) {
    this.doctorId = procedure.doctorId;
    this.procedureName = procedure.procedureName;
    this.procedureDescription = procedure.procedureDescription;
    this.averageRating = procedure.averageRating;
  }
}
