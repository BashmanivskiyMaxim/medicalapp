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
import { DatabaseAccountRepository } from './account.repository';
import { DatabaseAddressRepository } from './address.repository';
import { DatabaseAppointmentRepository } from './appointment.repository';
import { DatabaseContactInfoRepository } from './contactInfo.repository';
import { DatabaseDoctorRepository } from './doctor.repository';
import { DatabaseMedicalHistoryRepository } from './medicalHistory.repository';
import { DatabaseMedicalProcedureRepository } from './medicalProcedure.repository';
import { DatabaseMessageRepository } from './message.repository';
import { DatabasePatientRepository } from './patient.repository';
import { DatabaseScheduleRepository } from './schedule.repository';

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
    DatabaseAccountRepository,
    DatabaseAddressRepository,
    DatabaseAppointmentRepository,
    DatabaseContactInfoRepository,
    DatabaseDoctorRepository,
    DatabaseMedicalHistoryRepository,
    DatabaseMedicalProcedureRepository,
    DatabaseMessageRepository,
    DatabasePatientRepository,
    DatabaseScheduleRepository,
  ],
  exports: [
    DatabaseAccountRepository,
    DatabaseAddressRepository,
    DatabaseAppointmentRepository,
    DatabaseContactInfoRepository,
    DatabaseDoctorRepository,
    DatabaseMedicalHistoryRepository,
    DatabaseMedicalProcedureRepository,
    DatabaseMessageRepository,
    DatabasePatientRepository,
    DatabaseScheduleRepository,
  ],
})
export class RepositoriesModule {}
