import { Entity, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm';
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
}
