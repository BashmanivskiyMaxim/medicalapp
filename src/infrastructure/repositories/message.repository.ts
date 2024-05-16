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
  async createMessage(message: MessageModel): Promise<any> {
    const encryptedMessageContent = await this.messageEntityRepository.query(
      `SELECT pgp_sym_encrypt($1, $2) AS encrypted_message`,
      [message.messageContent, process.env.ENCRYPTION_KEY],
    );
    const messageEntity = this.messageEntityRepository.create({
      id: message.id,
      sender: { id: message.senderId },
      receiver: { id: message.receiverId },
      role: message.role,
      messageContent: encryptedMessageContent[0].encrypted_message,
      timestamp: message.timestamp,
    });
    return this.messageEntityRepository.save(messageEntity);
  }
  deleteMessage(message: MessageModel): Promise<any> {
    return this.messageEntityRepository.delete(message.id);
  }
  async getMessage(messageId: number): Promise<any> {
    return await this.messageEntityRepository.findOne({
      where: { id: messageId },
      select: [
        'id',
        'role',
        'messageContent',
        'timestamp',
        'sender',
        'receiver',
      ],
      relations: ['sender', 'receiver'],
    });
  }
  async decryptMessage(encryptedMessage: any): Promise<any> {
    const decryptedMessage = await this.messageEntityRepository.query(
      `SELECT pgp_sym_decrypt($1, $2) AS decrypted_message`,
      [encryptedMessage, process.env.ENCRYPTION_KEY],
    );
    return decryptedMessage[0].decrypted_message;
  }

  async getMessages(receiverId: number): Promise<any> {
    const messages = await this.messageEntityRepository.find({
      where: { receiver: { id: receiverId } },
    });
    for (const message of messages) {
      message.messageContent = await this.decryptMessage(
        message.messageContent,
      );
    }
    return messages;
  }
  async deleteMessageForReceiver(messageId: number): Promise<any> {
    return this.messageEntityRepository.update(messageId, {
      receiver: null,
    });
  }
}
