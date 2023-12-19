import { DynamicModule, Module } from '@nestjs/common';
import { LoggerModule } from '../logger/logger.module';
import { EnvironmentConfigModule } from '../config/environment-config/environment-config.module';
import { RepositoriesModule } from '../repositories/repositories.module';
import { ExceptionsModule } from '../exceptions/exceptions.module';
import { LoggerService } from '../logger/logger.service';
import { DatabaseDoctorRepository } from '../repositories/doctor.repository';
import { UseCaseProxy } from './usecases-proxy';
import { addDoctorUseCases } from 'src/usecases/doctor/addDoctor.usecases';
import { DatabasePatientRepository } from '../repositories/patient.repository';
import { addPatientUseCases } from 'src/usecases/patient/addPatient.usecases';
import { DatabaseAddressRepository } from '../repositories/address.repository';
import { addAddressUseCases } from 'src/usecases/address/addAddress.usecases';
import { DatabaseAppointmentRepository } from '../repositories/appointment.repository';
import { addAppointmentUseCases } from 'src/usecases/appointment/addAppointment.usecases';

@Module({
  imports: [
    LoggerModule,
    EnvironmentConfigModule,
    RepositoriesModule,
    ExceptionsModule,
  ],
})
export class UsecasesProxyModule {
  static POST_DOCTOR_USECASES_PROXY = 'postDoctorUseCasesProxy';
  static POST_PATIENT_USECASES_PROXY = 'postPatientUseCasesProxy';
  static POST_ADDRESS_USECASES_PROXY = 'postAddressUseCasesProxy';
  static POST_APPOINTMENT_USECASES_PROXY = 'postAppointmentUseCasesProxy';

  static regiter(): DynamicModule {
    return {
      module: UsecasesProxyModule,
      providers: [
        {
          inject: [LoggerService, DatabaseDoctorRepository],
          provide: UsecasesProxyModule.POST_DOCTOR_USECASES_PROXY,
          useFactory: (
            loggerService: LoggerService,
            databaseDoctorRepository: DatabaseDoctorRepository,
          ) =>
            new UseCaseProxy(
              new addDoctorUseCases(loggerService, databaseDoctorRepository),
            ),
        },
        {
          inject: [LoggerService, DatabasePatientRepository],
          provide: UsecasesProxyModule.POST_PATIENT_USECASES_PROXY,
          useFactory: (
            loggerService: LoggerService,
            databasePatientRepository: DatabasePatientRepository,
          ) =>
            new UseCaseProxy(
              new addPatientUseCases(loggerService, databasePatientRepository),
            ),
        },
        {
          inject: [LoggerService, DatabaseAddressRepository],
          provide: UsecasesProxyModule.POST_ADDRESS_USECASES_PROXY,
          useFactory: (
            loggerService: LoggerService,
            databaseAddressRepository: DatabaseAddressRepository,
          ) =>
            new UseCaseProxy(
              new addAddressUseCases(loggerService, databaseAddressRepository),
            ),
        },
        {
          inject: [LoggerService, DatabaseAppointmentRepository],
          provide: UsecasesProxyModule.POST_APPOINTMENT_USECASES_PROXY,
          useFactory: (
            loggerService: LoggerService,
            databaseAppointmentRepository: DatabaseAppointmentRepository,
          ) =>
            new UseCaseProxy(
              new addAppointmentUseCases(
                loggerService,
                databaseAppointmentRepository,
              ),
            ),
        },
      ],
      exports: [
        UsecasesProxyModule.POST_DOCTOR_USECASES_PROXY,
        UsecasesProxyModule.POST_PATIENT_USECASES_PROXY,
        UsecasesProxyModule.POST_ADDRESS_USECASES_PROXY,
        UsecasesProxyModule.POST_APPOINTMENT_USECASES_PROXY,
      ],
    };
  }
}
