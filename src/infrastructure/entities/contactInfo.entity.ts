import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { AccountEntity } from './account.entity';

@Entity('contact_info')
export class ContactInfoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  contactNumber: string;

  @OneToOne(() => AccountEntity)
  @JoinColumn({ name: 'account_id' })
  account: AccountEntity;
}
