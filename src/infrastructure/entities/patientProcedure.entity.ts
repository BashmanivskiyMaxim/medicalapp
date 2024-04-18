import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ProcedureEntity } from './procedure.entity';
import { DoctorEntity } from './doctor.entity';
import { PatientEntity } from './patient.entity';

@Entity('patient_procedure')
export class PatientProcedureEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'patient_id' })
  patientId: number;

  @Column({ name: 'doctor_id' })
  doctorId: number;

  @Column({ name: 'procedure_id' })
  procedureId: number;

  @Column({ name: 'procedure_date', type: 'date' })
  procedureDate: Date;

  @Column({ name: 'created_date', type: 'timestamp' })
  createdDate: Date;

  @Column({ name: 'updated_date', type: 'timestamp' })
  updatedDate: Date;

  @Column({ name: 'appointment_time', type: 'time' })
  appointmentTime: string;

  @Column({ type: 'json' })
  report: object;

  @Column()
  rating: number;

  @ManyToOne(() => PatientEntity, (patient) => patient.procedures)
  @JoinColumn({ name: 'patient_id' })
  patient: PatientEntity;

  @ManyToOne(() => DoctorEntity, (doctor) => doctor.procedures)
  @JoinColumn({ name: 'doctor_id' })
  doctor: DoctorEntity;

  @ManyToOne(() => ProcedureEntity, (procedure) => procedure.id)
  @JoinColumn({ name: 'procedure_id' })
  procedure: ProcedureEntity;
}
