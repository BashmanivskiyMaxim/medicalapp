import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { BaseAbstractRepository } from './base/base.abstract.repository';
import { MessageEntity } from '../entities/message.entity';
import { MessageRepository } from '../../domain/repositories/message.repository.interface';
import { MessageModel } from 'src/domain/model/messageModel';

@Injectable()
export class DatabaseMessageRepository
  extends BaseAbstractRepository<MessageEntity>
  implements MessageRepository
{
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageEntityRepository: Repository<MessageEntity>,
  ) {
    super(messageEntityRepository);
  }
  createMessage(message: MessageModel): Promise<any> {
    const messageEntity = this.messageEntityRepository.create({
      id: message.id,
      sender: { id: message.senderId },
      receiver: { id: message.receiverId },
      role: message.role,
      messageContent: message.messageContent,
      timestamp: message.timestamp,
    });
    return this.messageEntityRepository.save(messageEntity);
  }
  updateMessage(message: MessageModel): Promise<any> {
    return this.messageEntityRepository.update(message.id, {
      id: message.id,
      sender: { id: message.senderId },
      receiver: { id: message.receiverId },
      role: message.role,
      messageContent: message.messageContent,
      timestamp: message.timestamp,
    });
  }
  deleteMessage(message: MessageModel): Promise<any> {
    return this.messageEntityRepository.delete(message.id);
  }
  getMessage(message: MessageModel): Promise<any> {
    return this.messageEntityRepository.findOne({ where: { id: message.id } });
  }
  getMessages(receiverId: number): Promise<any> {
    return this.messageEntityRepository.find({
      where: { receiver: { id: receiverId } },
    });
  }
}
