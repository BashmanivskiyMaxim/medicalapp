import {
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  Column,
} from 'typeorm';
import { AccountEntity } from './account.entity';
import { DoctorEntity } from './doctor.entity';

@Entity('patient')
export class PatientEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => AccountEntity, (account) => account.patients)
  @JoinColumn({ name: 'account_id' })
  account: AccountEntity;

  @ManyToOne(() => DoctorEntity, (doctor) => doctor.account)
  @JoinColumn({ name: 'doctor_id' })
  doctor: DoctorEntity;

  @Column({ name: 'recovery_status', default: false })
  recovery_status: boolean;

  @Column({ name: 'additional_info', type: 'json', default: '{}' })
  additional_info: any;
}
