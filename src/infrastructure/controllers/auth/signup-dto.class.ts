import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SignUpDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  readonly username: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  readonly password: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  readonly firstName: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  readonly lastName: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  readonly accountType: string;
}
