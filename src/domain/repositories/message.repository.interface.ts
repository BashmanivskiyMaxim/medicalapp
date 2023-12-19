import { MessageModel } from '../model/messageModel';

export interface MessageRepository {
  createMessage(message: MessageModel): Promise<any>;
  updateMessage(message: MessageModel): Promise<any>;
  deleteMessage(message: MessageModel): Promise<any>;
  getMessage(message: MessageModel): Promise<any>;
}
