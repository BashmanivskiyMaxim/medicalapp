import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PatientEntity } from './patient.entity';
import { DoctorEntity } from './doctor.entity';
import { ScheduleEntity } from './schedule.entity';

@Entity('appointment')
export class AppointmentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => PatientEntity)
  @JoinColumn({ name: 'patient_id' })
  patient: PatientEntity;

  @ManyToOne(() => DoctorEntity)
  @JoinColumn({ name: 'doctor_id' })
  doctor: DoctorEntity;

  @ManyToOne(() => ScheduleEntity)
  @JoinColumn({ name: 'schedule_id' })
  schedule: ScheduleEntity;

  @Column({ name: 'appointmentDate' })
  appointmentDate: string;

  @Column({ name: 'appointmentTime' })
  appointmentTime: string;

  @Column({ name: 'reason' })
  reason: string;
}
