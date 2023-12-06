import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { BaseAbstractRepository } from './base/base.abstract.repository';
import { MessageEntity } from '../entities/message.entity';
import { MessageRepositoryInterface } from '../../domain/repositories/message.repository.interface';

@Injectable()
export class MessageRepository
  extends BaseAbstractRepository<MessageEntity>
  implements MessageRepositoryInterface
{
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageEntity: Repository<MessageEntity>,
  ) {
    super(messageEntity);
  }

  public async findmess(): Promise<MessageEntity | undefined> {
    return await this.messageEntity.findOne({});
  }
}
