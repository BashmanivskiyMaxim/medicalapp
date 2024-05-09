import {
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  Column,
  OneToMany,
} from 'typeorm';
import { AccountEntity } from './account.entity';
import { PatientProcedureEntity } from './patientProcedure.entity';

@Entity('patient')
export class PatientEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => AccountEntity, (account) => account.patients)
  @JoinColumn({ name: 'account_id' })
  account: AccountEntity;

  @OneToMany(
    () => PatientProcedureEntity,
    (patientProcedure) => patientProcedure.patient,
  )
  procedures: PatientProcedureEntity[];

  @Column({ name: 'recovery_status', default: false })
  recovery_status: boolean;

  @Column({ name: 'additional_info', type: 'bytea' })
  additional_info: Buffer;
}
