import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { BaseAbstractRepository } from './base/base.abstract.repository';
import { AccountEntity } from '../entities/account.entity';
import { AccountRepositoryInterface } from '../../domain/repositories/account.repository.interface';

@Injectable()
export class AccountRepository
  extends BaseAbstractRepository<AccountEntity>
  implements AccountRepositoryInterface
{
  constructor(
    @InjectRepository(AccountEntity)
    private readonly accountEntity: Repository<AccountEntity>,
  ) {
    super(accountEntity);
  }

  public async findByEmail(email: string): Promise<AccountEntity> {
    return await this.accountEntity.findOne({ where: { email } });
  }
}
