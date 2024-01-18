import { ILogger } from 'src/domain/logger/logger.interface';
import { AccountModel } from 'src/domain/model/accountModel';
import { AccountRepository } from 'src/domain/repositories/account.repository.interface';

export class getAccountByEmailUseCases {
  constructor(
    private readonly logger: ILogger,
    private readonly AccountRepository: AccountRepository,
  ) {}
  async execute(data: AccountModel): Promise<AccountModel> {
    const account = new AccountModel();
    account.email = data.email;
    account.password = data.password;
    account.username = data.username;
    account.firstName = data.firstName;
    account.lastName = data.lastName;
    account.accountType = data.accountType;

    const result = await this.AccountRepository.findAccountByEmail(
      account.email,
    );
    this.logger.log(
      'getAccountUseCases execute',
      'New account have been inserted',
    );
    return result;
  }
}
