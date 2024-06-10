import { AccountRepository } from '../../domain/repositories/account.repository.interface';
import { ILogger } from '../../domain/logger/logger.interface';
import { UserM } from '../../domain/model/accountModel';
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

  async changeRole(id: string, adminAccount: any) {
    const account = await this.userRepository.findAccountById(+id);
    if (!account) {
      throw new NotFoundException(`Account with id ${id} not found`);
    }
    if (adminAccount.accountType !== 'admin') {
      throw new NotFoundException(
        'Permission denied. Only admin can execute this operation.',
      );
    }
    const updatedAccount = await this.userRepository.changeAccountType(
      id,
      'user',
    );
    this.logger.log(
      'UpdateAccountUseCases execute',
      'Update role account have been inserted',
    );
    return updatedAccount;
  }
}
