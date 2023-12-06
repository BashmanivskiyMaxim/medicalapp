import { BaseInterfaceRepository } from '@app/shared';
import { AddressEntity } from '../entities/address.entity';

export interface AddressRepositoryInterface
  extends BaseInterfaceRepository<AddressEntity> {
  findAddress(
    userId: number,
    friendId: number,
  ): Promise<AddressEntity | undefined>;
}
