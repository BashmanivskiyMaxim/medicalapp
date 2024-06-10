import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AddProcedureDto {
  @ApiProperty({ required: true })
  @IsString()
  readonly procedureName: string;
  @ApiProperty({ required: true })
  @IsString()
  readonly procedureDescription: string;
  @ApiProperty({ required: true })
  @IsString()
  readonly doctorId: string;
}

export class UpdateProcedureDto {
  @ApiProperty({ required: true })
  @IsString()
  readonly procedureName: string;
  @ApiProperty({ required: true })
  @IsString()
  readonly procedureDescription: string;
  @ApiProperty({ required: true })
  @IsString()
  readonly doctorId: string;
}
