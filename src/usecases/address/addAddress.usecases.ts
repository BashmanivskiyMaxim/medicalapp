import { ILogger } from '../../domain/logger/logger.interface';
import { AddressRepository } from '../../domain/repositories/address.repository.interface';
import { AddressModel } from '../../domain/model/addressModel';
import { EntityValidator } from '../utils/checkExistense.usecases';
import { ConflictException } from '@nestjs/common';

export class addAddressUseCases {
  constructor(
    private readonly logger: ILogger,
    private readonly AddressRepository: AddressRepository,
    private readonly checkExistenceUseCase: EntityValidator,
  ) {}
  async execute(data: AddressModel, account_id: string): Promise<AddressModel> {
    await this.checkExistenceUseCase.existence(account_id, true);
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

  async updateAddress(data: AddressModel, account_id: string): Promise<any> {
    await this.checkExistenceUseCase.existence(account_id, false);
    const address = new AddressModel();
    address.address = data.address;
    const result = await this.AddressRepository.updateAddress(
      address,
      +account_id,
    );
    this.logger.log(
      'updateAddressUseCases execute',
      'Address have been updated',
    );
    return result;
  }

  async deleteAddress(account_id: string): Promise<AddressModel> {
    await this.checkExistenceUseCase.existence(account_id, false);
    const existingAddressAccount =
      await this.AddressRepository.findByAccountId(+account_id);
    const result = await this.AddressRepository.deleteAddress(
      +existingAddressAccount.id,
    );
    this.logger.log(
      'deleteAddressUseCases execute',
      'Address have been deleted',
    );
    return result;
  }

  async getAllAddresses(account_type: string): Promise<AddressModel> {
    if (account_type == 'admin') {
      const result = await this.AddressRepository.getAllAddresses();
      this.logger.log(
        'getAllAddressesUseCases execute',
        'Addresses have been geted',
      );
      return result;
    } else throw new ConflictException('Permission denied');
  }
}
