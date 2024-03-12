import { AccountModel, UserM } from 'src/domain/model/accountModel';
import { AccountRepository } from 'src/domain/repositories/account.repository.interface';

export class IsAuthenticatedUseCases {
  constructor(private readonly adminUserRepo: AccountRepository) {}

  async execute(username: string): Promise<AccountModel> {
    const user: UserM = await this.adminUserRepo.getUserByUsername(username);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...info } = user;

    return info;
  }
}
