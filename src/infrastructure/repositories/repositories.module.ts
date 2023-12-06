import { Module } from '@nestjs/common';
import { TypeOrmConfigModule } from '../config/typeorm/typeorm.module';
import { AccountEntity } from '../entities/account.entity';
import { ScheduleEntity } from '../entities/schedule.entity';
import { MessageEntity } from '../entities/message.entity';
import { AddressEntity } from '../entities/address.entity';
import { AppointmentEntity } from '../entities/appointment.entity';
import { DoctorEntity } from '../entities/doctor.entity';
import { PatientEntity } from '../entities/patient.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicalProcedureEntity } from '../entities/medicalProcedure.entity';
import { MedicalHistoryEntity } from '../entities/medicalHistory.entity';
import { ContactInfoEntity } from '../entities/contactInfo.entity';
import { AccountRepository } from './account.repository';
import { AddressRepository } from './address.repository';
import { AppointmentRepository } from './appointment.repository';
import { ContactInfoRepository } from './contactInfo.repository';
import { DoctorRepository } from './doctor.repository';
import { MedicalHistoryRepository } from './medicalHistory.repository';
import { MedicalProcedureRepository } from './medicalProcedure.repository';
import { MessageRepository } from './message.repository';
import { PatientRepository } from './patient.repository';
import { ScheduleRepository } from './schedule.repository';

@Module({
  imports: [
    TypeOrmConfigModule,
    TypeOrmModule.forFeature([
      AccountEntity,
      AddressEntity,
      PatientEntity,
      DoctorEntity,
      AppointmentEntity,
      ScheduleEntity,
      MessageEntity,
      MedicalProcedureEntity,
      MedicalHistoryEntity,
      ContactInfoEntity,
    ]),
  ],
  providers: [
    AccountRepository,
    AddressRepository,
    AppointmentRepository,
    ContactInfoRepository,
    DoctorRepository,
    MedicalHistoryRepository,
    MedicalProcedureRepository,
    MessageRepository,
    PatientRepository,
    ScheduleRepository,
  ],
  exports: [
    AccountRepository,
    AddressRepository,
    AppointmentRepository,
    ContactInfoRepository,
    DoctorRepository,
    MedicalHistoryRepository,
    MedicalProcedureRepository,
    MessageRepository,
    PatientRepository,
    ScheduleRepository,
  ],
})
export class RepositoriesModule {}
