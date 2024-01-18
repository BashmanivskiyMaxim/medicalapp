import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AddAccountDto {
  @ApiProperty()
  @IsString()
  readonly username: string;

  @ApiProperty()
  @IsString()
  readonly password: string;

  @ApiProperty()
  @IsString()
  readonly email: string;

  @ApiProperty()
  @IsString()
  readonly firstName: string;

  @ApiProperty()
  @IsString()
  readonly lastName: string;

  @ApiProperty()
  @IsString()
  readonly accountType: string;
}
