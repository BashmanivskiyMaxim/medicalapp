import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseAbstractRepository } from './base/base.abstract.repository';
import { AccountEntity } from '../entities/account.entity';
import { AccountRepository } from '../../domain/repositories/account.repository.interface';
import { AccountModel } from 'src/domain/model/accountModel';

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
  createAccount(data: AccountModel): Promise<any> {
    console.log(data);
    const account = this.AccountEntityRepository.create(data);
    console.log(account);
    return this.AccountEntityRepository.save(account);
  }
  findAccountByEmail(email: string): Promise<any> {
    return this.AccountEntityRepository.findOne({ where: { email } });
  }
  findAccountById(id: number): Promise<any> {
    return this.AccountEntityRepository.findOne({ where: { id } });
  }
  updateAccountById(id: string, data: any): Promise<any> {
    return this.AccountEntityRepository.update(id, data);
  }
  deleteAccountById(id: string): Promise<any> {
    return this.AccountEntityRepository.delete(id);
  }
}
