import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { PatientEntity } from './patient.entity';

@Entity()
export class DoctorEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  accountId: number;

  @Column()
  specialty: string;

  @Column()
  qualification: string;

  @OneToMany(() => PatientEntity, (patient) => patient.id)
  patients: PatientEntity[];
}
