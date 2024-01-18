import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { DoctorEntity } from './doctor.entity';

@Entity('schedule')
export class ScheduleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => DoctorEntity)
  @JoinColumn({ name: 'doctor_id' })
  doctor: DoctorEntity;

  @Column({ name: 'dayOfWeek' })
  dayOfWeek: string;

  @Column({ name: 'startTime' })
  startTime: string;

  @Column({ name: 'endTime' })
  endTime: string;
}
