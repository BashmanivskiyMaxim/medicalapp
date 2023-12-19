import { ILogger } from 'src/domain/logger/logger.interface';
import { AddressRepository } from 'src/domain/repositories/address.repository.interface';
import { AddressModel } from 'src/domain/model/addressModel';

export class addAddressUseCases {
  constructor(
    private readonly logger: ILogger,
    private readonly AddressRepository: AddressRepository,
  ) {}
  async execute(data: AddressModel): Promise<AddressModel> {
    const address = new AddressModel();
    address.id = data.id;
    address.address = data.address;
    address.accountId = data.accountId;
    const result = await this.AddressRepository.createAddress(address);
    this.logger.log(
      'addAddressUseCases execute',
      'New apointment have been inserted',
    );
    return result;
  }
}
