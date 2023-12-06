import { BaseInterfaceRepository } from '@app/shared';

import { ContactInfoEntity } from '../entities/contactInfo.entity';

export interface ContactInfoRepositoryInterface
  extends BaseInterfaceRepository<ContactInfoEntity> {
  findInfo(
    userId: number,
    friendId: number,
  ): Promise<ContactInfoEntity | undefined>;
}
