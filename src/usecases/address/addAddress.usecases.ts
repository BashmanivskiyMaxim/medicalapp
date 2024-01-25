import { ILogger } from 'src/domain/logger/logger.interface';
import { AddressRepository } from 'src/domain/repositories/address.repository.interface';
import { AddressModel } from 'src/domain/model/addressModel';
import { CheckExistenceUseCase } from '../utils/checkExistense.usecases';

export class addAddressUseCases {
  constructor(
    private readonly logger: ILogger,
    private readonly AddressRepository: AddressRepository,
    private readonly checkExistenceUseCase: CheckExistenceUseCase,
  ) {}
  async execute(data: AddressModel, account_id: string): Promise<AddressModel> {
    await this.checkExistenceUseCase.execute(account_id, true);
    const address = new AddressModel();
    address.accountId = +account_id;
    address.address = data.address;
    const result = await this.AddressRepository.createAddress(address);
    this.logger.log(
      'addAddressUseCases execute',
      'New address have been inserted',
    );
    return result;
  }
}
