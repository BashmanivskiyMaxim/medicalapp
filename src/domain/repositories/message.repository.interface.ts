import { BaseInterfaceRepository, MessageEntity } from '@app/shared';

export interface MessageRepositoryInterface
  extends BaseInterfaceRepository<MessageEntity> {
  findmess(
    userId: number,
    friendId: number,
  ): Promise<MessageEntity | undefined>;
}
