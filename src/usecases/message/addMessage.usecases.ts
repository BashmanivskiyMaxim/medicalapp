import { ILogger } from 'src/domain/logger/logger.interface';
import { MessageModel } from 'src/domain/model/messageModel';
import { MessageRepository } from 'src/domain/repositories/message.repository.interface';

export class addMessageUseCases {
  constructor(
    private readonly logger: ILogger,
    private readonly messageRepository: MessageRepository,
  ) {}
  async execute(data: MessageModel): Promise<MessageModel> {
    const message = new MessageModel();
    message.id = data.id;
    message.senderId = data.senderId;
    message.receiverId = data.receiverId;
    message.role = data.role;
    message.messageContent = data.messageContent;
    message.timestamp = data.timestamp;
    const result = await this.messageRepository.createMessage(message);
    this.logger.log(
      'addMessageUseCases execute',
      'New Message have been inserted',
    );
    return result;
  }
}
