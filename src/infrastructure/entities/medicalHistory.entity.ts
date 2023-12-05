import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
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

  @ManyToOne(() => MedicalProcedureEntity)
  @JoinColumn({ name: 'medical_procedure_id' })
  medicalProcedure: MedicalProcedureEntity;

  @Column()
  date: Date;
}
