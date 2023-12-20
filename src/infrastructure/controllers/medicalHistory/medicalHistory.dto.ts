import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsNumber } from 'class-validator';

export class AddMedicalHistoryDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsNumber()
  readonly id: number;
  @IsNumber()
  readonly patientId: number;
  @IsNumber()
  readonly medicalProcedureId: number;
  @IsDate()
  readonly date: Date;
}
