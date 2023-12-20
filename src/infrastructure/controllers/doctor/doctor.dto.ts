import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { PatientModel } from 'src/domain/model/patientModel';

export class AddDoctorDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsNumber()
  readonly id: number;
  @IsNumber()
  readonly accountId: number;
  @IsString()
  readonly specialty: string;
  @IsString()
  readonly qualification: string;
  readonly patients: PatientModel[];
}
