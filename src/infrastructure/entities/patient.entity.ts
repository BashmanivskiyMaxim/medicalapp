import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { AccountEntity } from './account.entity';
import { DoctorEntity } from './doctor.entity';

@Entity()
export class PatientEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => AccountEntity, (account) => account.id)
  accountId: AccountEntity;

  @ManyToOne(() => DoctorEntity, (doctor) => doctor.id)
  doctorId: DoctorEntity;
}
