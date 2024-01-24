import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class AddContactInfoDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber('UA')
  readonly contactNumber: string;
}
