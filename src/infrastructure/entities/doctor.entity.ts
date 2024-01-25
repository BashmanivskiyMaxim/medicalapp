import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { AccountEntity } from './account.entity';

@Entity('doctor')
export class DoctorEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  specialty: string;

  @Column()
  qualification: string;

  @ManyToOne(() => AccountEntity, (account) => account.doctors)
  @JoinColumn({ name: 'account_id' })
  account: AccountEntity;
}
