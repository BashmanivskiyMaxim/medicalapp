import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { AccountEntity } from './account.entity';

@Entity('message')
export class MessageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => AccountEntity)
  @JoinColumn({ name: 'sender_id' })
  sender: AccountEntity;

  @ManyToOne(() => AccountEntity)
  @JoinColumn({ name: 'receiver_id' })
  receiver: AccountEntity;

  @Column()
  role: string;

  @Column({ name: 'messageContent', type: 'bytea' })
  messageContent: Buffer;

  @Column({ name: 'timestamp', type: 'timestamp' })
  timestamp: Date;
}
