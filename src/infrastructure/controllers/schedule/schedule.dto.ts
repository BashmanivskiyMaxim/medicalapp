import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AddScheduleDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsNumber()
  readonly id: number;
  @IsString()
  readonly dayOfWeek: string;
  @IsString()
  readonly startTime: string;
  @IsString()
  readonly endTime: string;
  @IsNumber()
  readonly doctorId: number;
}
