export class MessageModel {
  id?: number;
  senderId?: number;
  receiverId: number;
  role?: string;
  messageContent: string;
  timestamp?: Date;
}
