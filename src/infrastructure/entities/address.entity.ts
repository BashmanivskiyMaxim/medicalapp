import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { AccountEntity } from './account.entity';

@Entity('address')
export class AddressEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  address: string;

  @OneToOne(() => AccountEntity)
  @JoinColumn({ name: 'account_id' })
  account: AccountEntity;
}
