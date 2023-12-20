import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AddAppointmentDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsNumber()
  readonly id: number;
  @IsNumber()
  readonly patientId: number;
  @IsNumber()
  readonly doctorId: number;
  @IsNumber()
  readonly scheduleId: number;
  @IsDate()
  readonly appointmentDate: Date;
  @IsString()
  readonly appointmentTime: string;
  @IsString()
  readonly reason: string;
}
