import { ILogger } from 'src/domain/logger/logger.interface';
import { MessageModel } from 'src/domain/model/messageModel';
import { MessageRepository } from 'src/domain/repositories/message.repository.interface';
import { IEncryptService } from 'src/domain/adapters/encrypt.interface';

export class addMessageUseCases {
  constructor(
    private readonly logger: ILogger,
    private readonly messageRepository: MessageRepository,
    private readonly encryptService: IEncryptService,
  ) {}
  async execute(data: MessageModel, accountSender: any): Promise<MessageModel> {
    const encryptedMessage = await this.encryptService.encrypt(
      data.messageContent,
    );
    const message = new MessageModel();
    message.senderId = accountSender.id;
    message.receiverId = data.receiverId;
    message.role = accountSender.accountType;
    message.messageContent = encryptedMessage;
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
    console.log(result);
    await Promise.all(
      result.map(async (message: any) => {
        message.messageContent = await this.encryptService.decrypt(
          message.messageContent,
        );
      }),
    );
    console.log(result);
    this.logger.log(
      'getMessagesUseCases execute',
      'Messages have been fetched',
    );
    return result;
  }
}
