import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsEmail,
} from 'class-validator';

const MIN_LENGTH = 1;
const MAX_LENGTH = 100;

export class AddMessageDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsEmail()
  readonly receiverEmail: string;
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  @MinLength(MIN_LENGTH)
  @MaxLength(MAX_LENGTH)
  readonly messageContent: string;
}
