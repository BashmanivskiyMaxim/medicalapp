import { ILogger } from '../../domain/logger/logger.interface';
import { MessageModel } from '../../domain/model/messageModel';
import { MessageRepository } from '../../domain/repositories/message.repository.interface';
import { IEncryptService } from '../../domain/adapters/encrypt.interface';

export class addMessageUseCases {
  constructor(
    private readonly logger: ILogger,
    private readonly messageRepository: MessageRepository,
    private readonly encryptService: IEncryptService,
  ) {}
  async execute(data: MessageModel, accountSender: any): Promise<MessageModel> {
    if (accountSender.id === data.receiverId) {
      throw new Error('You cannot send a message to yourself');
    }
    const message = new MessageModel();
    message.senderId = accountSender.id;
    message.receiverId = data.receiverId;
    message.role = accountSender.accountType;
    message.messageContent = data.messageContent;
    message.timestamp = new Date();
    const result = await this.messageRepository.createMessage(message);
    this.logger.log(
      'addMessageUseCases execute',
      'New Message have been inserted',
    );
    return result;
  }
  async getMessages(accountReceiver: any): Promise<MessageModel[]> {
    const result = await this.messageRepository.getMessages(
      +accountReceiver.id,
    );
    this.logger.log(
      'getMessagesUseCases execute',
      'Messages have been fetched',
    );
    return result;
  }
  async deleteMessage(messageId: string, account: any): Promise<void> {
    const message = await this.messageRepository.getMessage(+messageId);
    if (account.id !== message.sender.id) {
      throw new Error('You are not the sender of this message');
    }
    await this.messageRepository.deleteMessage(message);
    this.logger.log(
      'deleteMessageUseCases execute',
      'Message have been deleted',
    );
  }
}
