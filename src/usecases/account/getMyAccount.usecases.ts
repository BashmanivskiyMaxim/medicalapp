import { AccountRepository } from '../../domain/repositories/account.repository.interface';
import { ILogger } from '../../domain/logger/logger.interface';
import { AccountModel } from '../../domain/model/accountModel';
import { NotFoundException } from '@nestjs/common';

export class GetAccountUseCases {
  constructor(
    private readonly logger: ILogger,
    private readonly userRepository: AccountRepository,
  ) {}

  async getAccountInfo(id: string): Promise<AccountModel> {
    try {
      const account: AccountModel =
        await this.userRepository.findAccountById(+id);
      this.logger.log(
        'GetAccountUseCases execute',
        'Get info account have been inserted',
      );
      console.log(account);
      return account;
    } catch (error) {
      throw new NotFoundException(`Account with id ${id} not found`);
    }
  }
}
