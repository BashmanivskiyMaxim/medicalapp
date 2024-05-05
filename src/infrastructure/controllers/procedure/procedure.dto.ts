import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AddProcedureDto {
  @ApiProperty({ required: true })
  @IsString()
  readonly doctorUsername: string;
  @ApiProperty({ required: true })
  @IsString()
  readonly procedureName: string;
  @ApiProperty({ required: true })
  @IsString()
  readonly procedureDescription: string;
}
