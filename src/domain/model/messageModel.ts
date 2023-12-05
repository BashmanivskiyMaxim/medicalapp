export class MessageModel {
  id: number;
  senderId: number;
  receiverId: number;
  role: string;
  messageContent: string;
  timestamp: Date;

  constructor(
    id: number,
    senderId: number,
    receiverId: number,
    role: string,
    messageContent: string,
    timestamp: Date,
  ) {
    this.id = id;
    this.senderId = senderId;
    this.receiverId = receiverId;
    this.role = role;
    this.messageContent = messageContent;
    this.timestamp = timestamp;
  }
}
