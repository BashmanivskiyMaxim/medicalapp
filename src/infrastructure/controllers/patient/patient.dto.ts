import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsObject } from 'class-validator';

export class AddPatientDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsNumber()
  readonly accountId: number;
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsBoolean()
  readonly recovery_status: boolean;
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsObject()
  readonly additional_info: object;
}
