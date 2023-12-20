import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AddAccountDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsNumber()
  readonly id: number;
  @IsString()
  readonly username: string;
  @IsString()
  readonly password: string;
  @IsString()
  readonly email: string;
  @IsString()
  readonly firstName: string;
  @IsString()
  readonly lastName: string;
  @IsString()
  readonly accountType: string;
}
