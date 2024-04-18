import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { DoctorEntity } from './doctor.entity';

@Entity('procedure')
export class ProcedureEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'doctor_id' })
  doctorId: number;

  @Column({ name: 'procedure_name' })
  procedureName: string;

  @Column({ name: 'procedure_description' })
  procedureDescription: string;

  @Column({ name: 'average_rating', type: 'double precision' })
  averageRating: number;

  @ManyToOne(() => DoctorEntity, (doctor) => doctor.procedures)
  @JoinColumn({ name: 'doctor_id' })
  doctor: DoctorEntity;
}
