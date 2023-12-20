import { ApiProperty } from '@nestjs/swagger';
import { MessageModel } from 'src/domain/model/messageModel';

export class MessagePresenter {
  @ApiProperty()
  id: number;
  @ApiProperty()
  senderId: number;
  @ApiProperty()
  receiverId: number;
  @ApiProperty()
  role: string;
  @ApiProperty()
  messageContent: string;
  @ApiProperty()
  timestamp: Date;

  constructor(message: MessageModel) {
    this.id = message.id;
    this.senderId = message.senderId;
    this.receiverId = message.receiverId;
    this.role = message.role;
    this.messageContent = message.messageContent;
    this.timestamp = message.timestamp;
  }
}
