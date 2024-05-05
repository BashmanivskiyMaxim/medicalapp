import { ApiProperty } from '@nestjs/swagger';

export class ProcedurePresenter {
  @ApiProperty()
  doctorId: number;
  @ApiProperty()
  procedure_name: string;
  @ApiProperty()
  procedure_description: string;
  @ApiProperty()
  average_rating: number;

  constructor(procedure: any) {
    this.doctorId = procedure.doctorId;
    this.procedure_name = procedure.procedure_name;
    this.procedure_description = procedure.procedure_description;
    this.average_rating = procedure.average_rating;
  }
}
