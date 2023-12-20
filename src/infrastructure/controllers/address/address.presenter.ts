import { ApiProperty } from '@nestjs/swagger';
import { AddressModel } from 'src/domain/model/addressModel';

export class AddressPresenter {
  @ApiProperty()
  id: number;
  @ApiProperty()
  address: string;
  @ApiProperty()
  accountId: number;

  constructor(address: AddressModel) {
    this.id = address.id;
    this.address = address.address;
    this.accountId = address.accountId;
  }
}
