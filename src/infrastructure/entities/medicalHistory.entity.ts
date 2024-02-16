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

  @Column({ name: 'created_date' })
  created_date: Date;

  @Column({ name: 'updated_date' })
  updated_date: Date;

  @OneToMany(
    () => MedicalProcedureEntity,
    (procedure) => procedure.medicalHistory,
  )
  procedures: MedicalProcedureEntity[];

  @Column({ name: 'medical_info', type: 'json' })
  medical_info: any;
}
