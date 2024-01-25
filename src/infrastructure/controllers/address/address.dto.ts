import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddAddressDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  readonly address: string;
}
