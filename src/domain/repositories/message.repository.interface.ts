import { MessageModel } from '../model/messageModel';

export interface MessageRepository {
  createMessage(message: MessageModel): Promise<any>;
  deleteMessage(message: MessageModel): Promise<any>;
  getMessage(messageId: number): Promise<any>;
  getMessages(receiverId: number): Promise<any>;
  decryptMessage(encryptedMessage: any): Promise<any>;
  deleteMessageForReceiver(messageId: number): Promise<any>;
}
