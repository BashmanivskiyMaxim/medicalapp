import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AddDoctorDto {
  @ApiProperty({ required: true })
  @IsString()
  readonly specialty: string;
  @ApiProperty({ required: true })
  @IsString()
  readonly qualification: string;
}
