import { ApiProperty } from '@nestjs/swagger';
import {
  IsMilitaryTime,
  IsNotEmpty,
  IsObject,
  IsNumber,
  Min,
  Max,
} from 'class-validator';

export class AddPatientProcedureDto {
  @ApiProperty({ required: true })
  @IsNumber()
  readonly procedureId: number;

  @ApiProperty({ required: true })
  @IsMilitaryTime()
  readonly appointmentTime: string;
}

export class UpdatePatientProcedureDto {
  @ApiProperty({ required: true })
  @IsNumber()
  readonly procedureId: number;

  @ApiProperty({ required: true })
  @IsMilitaryTime()
  readonly appointmentTime: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsObject()
  readonly report: object;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  readonly rating: number;
}
