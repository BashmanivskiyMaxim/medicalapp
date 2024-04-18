import { Module } from '@nestjs/common';
import { TypeOrmConfigModule } from '../config/typeorm/typeorm.module';
import { AccountEntity } from '../entities/account.entity';
import { MessageEntity } from '../entities/message.entity';
import { AddressEntity } from '../entities/address.entity';
import { DoctorEntity } from '../entities/doctor.entity';
import { PatientEntity } from '../entities/patient.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactInfoEntity } from '../entities/contactInfo.entity';
import { DatabaseAccountRepository } from './account.repository';
import { DatabaseAddressRepository } from './address.repository';
import { DatabaseContactInfoRepository } from './contactInfo.repository';
import { DatabaseDoctorRepository } from './doctor.repository';
import { DatabaseMessageRepository } from './message.repository';
import { DatabasePatientRepository } from './patient.repository';
import { ProcedureEntity } from '../entities/procedure.entity';
import { PatientProcedureEntity } from '../entities/patientProcedure.entity';
import { DatabaseProcedureRepository } from './procedure.repository';
import { DatabasePatientProcedureRepository } from './patientProcedure.repository';

@Module({
  imports: [
    TypeOrmConfigModule,
    TypeOrmModule.forFeature([
      AccountEntity,
      AddressEntity,
      PatientEntity,
      DoctorEntity,
      MessageEntity,
      ContactInfoEntity,
      ProcedureEntity,
      PatientProcedureEntity,
    ]),
  ],
  providers: [
    DatabaseAccountRepository,
    DatabaseAddressRepository,
    DatabaseContactInfoRepository,
    DatabaseDoctorRepository,
    DatabaseMessageRepository,
    DatabasePatientRepository,
    DatabaseProcedureRepository,
    DatabasePatientProcedureRepository,
  ],
  exports: [
    DatabaseAccountRepository,
    DatabaseAddressRepository,
    DatabaseContactInfoRepository,
    DatabaseDoctorRepository,
    DatabaseMessageRepository,
    DatabasePatientRepository,
    DatabaseProcedureRepository,
    DatabasePatientProcedureRepository,
  ],
})
export class RepositoriesModule {}
