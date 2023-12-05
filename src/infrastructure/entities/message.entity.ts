import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { AccountEntity } from './account.entity';

@Entity()
export class MessageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => AccountEntity)
  sender: AccountEntity;

  @ManyToOne(() => AccountEntity)
  receiver: AccountEntity;

  @Column()
  role: string;

  @Column()
  messageContent: string;

  @Column()
  timestamp: Date;
}
