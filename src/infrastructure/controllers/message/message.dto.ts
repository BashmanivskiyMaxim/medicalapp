import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  MinLength,
  MaxLength,
} from 'class-validator';

const MIN_LENGTH = 1;
const MAX_LENGTH = 100;

export class AddMessageDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsNumber()
  readonly receiverId: number;
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  @MinLength(MIN_LENGTH)
  @MaxLength(MAX_LENGTH)
  readonly messageContent: string;
}
