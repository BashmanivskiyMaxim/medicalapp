import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsObject } from 'class-validator';

export class AddMedicalHistoryDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsObject()
  readonly medicalInfo: object;
  @ApiProperty({ required: true })
  @IsNumber()
  @IsNotEmpty()
  readonly patientId: number;
}
