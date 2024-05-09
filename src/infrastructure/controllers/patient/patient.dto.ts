import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject } from 'class-validator';

export class AddPatientDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsObject()
  readonly additional_info: object;
}
