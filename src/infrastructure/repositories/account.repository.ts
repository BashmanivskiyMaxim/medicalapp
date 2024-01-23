import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseAbstractRepository } from './base/base.abstract.repository';
import { AccountEntity } from '../entities/account.entity';
import { AccountRepository } from '../../domain/repositories/account.repository.interface';
import { AccountModel, UserM } from 'src/domain/model/accountModel';

@Injectable()
export class DatabaseAccountRepository
  extends BaseAbstractRepository<AccountEntity>
  implements AccountRepository
{
  constructor(
    @InjectRepository(AccountEntity)
    private readonly AccountEntityRepository: Repository<AccountEntity>,
  ) {
    super(AccountEntityRepository);
  }
  async updateLastLogin(username: string): Promise<void> {
    await this.AccountEntityRepository.update(
      {
        username: username,
      },
      { last_login: () => 'CURRENT_TIMESTAMP' },
    );
  }
  async getUserByUsername(username: string): Promise<UserM> {
    const adminUserEntity = await this.AccountEntityRepository.findOne({
      where: {
        username: username,
      },
    });
    if (!adminUserEntity) {
      return null;
    }
    return this.toUser(adminUserEntity);
  }
  async updateRefreshToken(
    username: string,
    refreshToken: string,
  ): Promise<void> {
    await this.AccountEntityRepository.update(
      {
        username: username,
      },
      { hach_refresh_token: refreshToken },
    );
  }
  private toUser(adminUserEntity: AccountEntity): UserM {
    const adminUser: UserM = new UserM();

    adminUser.id = adminUserEntity.id;
    adminUser.username = adminUserEntity.username;
    adminUser.password = adminUserEntity.password;
    adminUser.createDate = adminUserEntity.createdate;
    adminUser.updatedDate = adminUserEntity.updateddate;
    adminUser.lastLogin = adminUserEntity.last_login;
    adminUser.hashRefreshToken = adminUserEntity.hach_refresh_token;
    adminUser.firstName = adminUserEntity.firstName;
    adminUser.lastName = adminUserEntity.lastName;
    adminUser.accountType = adminUserEntity.accountType;

    return adminUser;
  }
  createAccount(data: AccountModel): Promise<any> {
    const account = this.AccountEntityRepository.create(data);
    return this.AccountEntityRepository.save(account);
  }
  findAccountByEmail(email: string): Promise<any> {
    return this.AccountEntityRepository.findOne({ where: { email } });
  }
  findAccountById(id: number): Promise<any> {
    return this.AccountEntityRepository.findOne({ where: { id } });
  }
  updateAccountById(id: string, data: any): Promise<any> {
    return this.AccountEntityRepository.save({ id, ...data });
  }
  deleteAccountById(id: string): Promise<any> {
    return this.AccountEntityRepository.delete(id);
  }
}
