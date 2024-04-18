import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { AccountEntity } from './account.entity';
import { ProcedureEntity } from './procedure.entity';

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

  @OneToMany(() => ProcedureEntity, (procedure) => procedure.doctor)
  procedures: ProcedureEntity[];
}
