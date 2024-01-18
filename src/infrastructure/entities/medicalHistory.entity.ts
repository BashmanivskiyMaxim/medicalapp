import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { PatientEntity } from './patient.entity';
import { MedicalProcedureEntity } from './medicalProcedure.entity';

@Entity('medical_history')
export class MedicalHistoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => PatientEntity)
  @JoinColumn({ name: 'patient_id' })
  patient: PatientEntity;

  @Column({ name: 'date' })
  date: string;

  @OneToMany(
    () => MedicalProcedureEntity,
    (procedure) => procedure.medicalHistory,
  )
  procedures: MedicalProcedureEntity[];
}
