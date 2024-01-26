import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class AddPatientDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsNumber()
  readonly accountId: number;
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsNumber()
  readonly doctorId: number;
}
