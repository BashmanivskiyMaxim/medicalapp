import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AddMessageDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsNumber()
  readonly id: number;
  @IsNumber()
  readonly senderId: number;
  @IsNumber()
  readonly receiverId: number;
  @IsString()
  readonly role: string;
  @IsString()
  readonly messageContent: string;
  @IsDate()
  readonly timestamp: Date;
}
