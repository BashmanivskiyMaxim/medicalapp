import { BaseInterfaceRepository } from '@app/shared';
import { AccountEntity } from '../entities/account.entity';

export interface AccountRepositoryInterface
  extends BaseInterfaceRepository<AccountEntity> {
  findByEmail(email: string): Promise<AccountEntity>;
}
