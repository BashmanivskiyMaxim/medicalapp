import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { MedicalHistoryEntity } from './medicalHistory.entity';

@Entity('medical_procedure')
export class MedicalProcedureEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'procedureType' })
  procedureType: string;

  @Column({ name: 'description' })
  description: string;

  @ManyToOne(() => MedicalHistoryEntity)
  @JoinColumn({ name: 'medical_history_id' })
  medicalHistory: MedicalHistoryEntity;
}
