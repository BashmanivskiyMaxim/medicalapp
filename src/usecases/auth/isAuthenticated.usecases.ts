import { AccountRepository } from './../../infrastructure/repositories/account.repository';
import { UserM, UserWithoutPassword } from '../../domain/model/user';

export class IsAuthenticatedUseCases {
  constructor(private readonly adminUserRepo: AccountRepository) {}

  async execute(username: string): Promise<UserWithoutPassword> {
    const user: UserM = await this.adminUserRepo.getUserByUsername(username);
    const { password, ...info } = user;
    return info;
  }
}
