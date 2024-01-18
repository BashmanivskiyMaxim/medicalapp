import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
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

  @OneToOne(() => AccountEntity)
  @JoinColumn({ name: 'account_id' })
  account: AccountEntity;
}
