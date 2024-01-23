import { AccountRepository } from 'src/domain/repositories/account.repository.interface';
import { ILogger } from '../../domain/logger/logger.interface';
import { UserM } from 'src/domain/model/accountModel';
import { NotFoundException } from '@nestjs/common';

export class UpdateAccountUseCases {
  constructor(
    private readonly logger: ILogger,
    private readonly userRepository: AccountRepository,
  ) {}

  async updateAccountInfo(id: string, data: any) {
    try {
      const account: UserM = { updatedDate: new Date(), ...data };
      const updatedAccount = await this.userRepository.updateAccountById(
        id,
        account,
      );
      this.logger.log(
        'UpdateAccountUseCases execute',
        'Update info account have been inserted',
      );
      return updatedAccount;
    } catch (error) {
      throw new NotFoundException(`Account with id ${id} not found`);
    }
  }
}
