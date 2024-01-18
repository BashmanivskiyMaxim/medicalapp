import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ContactInfoEntity } from './contactInfo.entity';
import { AddressEntity } from './address.entity';
import { DoctorEntity } from './doctor.entity';
import { PatientEntity } from './patient.entity';
import { MessageEntity } from './message.entity';

@Entity('account')
export class AccountEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column('varchar', { unique: true })
  username: string;

  @Column('text')
  password: string;

  @CreateDateColumn({ name: 'createdate' })
  createdate: Date;

  @UpdateDateColumn({ name: 'updateddate' })
  updateddate: Date;

  @Column('varchar', { unique: true })
  email: string;

  @Column({ nullable: true })
  last_login?: Date;

  @Column('varchar', { nullable: true })
  hach_refresh_token: string;

  @Column({ name: 'firstName' })
  firstName: string;

  @Column({ name: 'lastName' })
  lastName: string;

  @Column({ name: 'accountType' })
  accountType: string;

  @OneToOne(() => ContactInfoEntity, { cascade: true })
  contactInfo: ContactInfoEntity;

  @OneToOne(() => AddressEntity, { cascade: true })
  address: AddressEntity;

  @OneToOne(() => DoctorEntity, { cascade: true })
  doctor: DoctorEntity;

  @OneToOne(() => PatientEntity, { cascade: true })
  patient: PatientEntity;

  @OneToMany(() => MessageEntity, (message) => message.sender)
  sentMessages: MessageEntity[];

  @OneToMany(() => MessageEntity, (message) => message.receiver)
  receivedMessages: MessageEntity[];
}
