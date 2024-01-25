import { DynamicModule, Module } from '@nestjs/common';
import { LoggerModule } from '../logger/logger.module';
import { EnvironmentConfigModule } from '../config/environment-config/environment-config.module';
import { RepositoriesModule } from '../repositories/repositories.module';
import { ExceptionsModule } from '../exceptions/exceptions.module';
import { LoggerService } from '../logger/logger.service';
import { DatabaseDoctorRepository } from '../repositories/doctor.repository';
import { UseCaseProxy } from './usecases-proxy';
import { addDoctorUseCases } from 'src/usecases/doctor/doctor.usecases';
import { DatabasePatientRepository } from '../repositories/patient.repository';
import { addPatientUseCases } from 'src/usecases/patient/addPatient.usecases';
import { DatabaseAddressRepository } from '../repositories/address.repository';
import { addAddressUseCases } from 'src/usecases/address/addAddress.usecases';
import { DatabaseAppointmentRepository } from '../repositories/appointment.repository';
import { addAppointmentUseCases } from 'src/usecases/appointment/addAppointment.usecases';
import { DatabaseAccountRepository } from '../repositories/account.repository';
import { addAccountUseCases } from 'src/usecases/account/addAccount.usecases';
import { DatabaseContactInfoRepository } from '../repositories/contactInfo.repository';
import { addContactInfoUseCases } from 'src/usecases/contactInfo/addContactInfo.usecases';
import { DatabaseMedicalHistoryRepository } from '../repositories/medicalHistory.repository';
import { addMedicalHistoryUseCases } from 'src/usecases/medicalHistory/addMedicalHistory.usecases';
import { DatabaseMedicalProcedureRepository } from '../repositories/medicalProcedure.repository';
import { addMedicalProcedureUseCases } from 'src/usecases/medicalProcedure/addMedicalProcedure.usecases';
import { DatabaseScheduleRepository } from '../repositories/schedule.repository';
import { addScheduleUseCases } from 'src/usecases/schedule/addSchedule.usecases';
import { DatabaseMessageRepository } from '../repositories/message.repository';
import { addMessageUseCases } from 'src/usecases/message/addMessage.usecases';
import { getAccountByEmailUseCases } from 'src/usecases/account/getAccountByEmail.usecases';
import { JwtTokenService } from '../services/jwt/jwt.service';
import { EnvironmentConfigService } from '../config/environment-config/environment-config.service';
import { BcryptService } from '../services/bcrypt/bcrypt.service';
import { LoginUseCases } from 'src/usecases/account/login.usecases';
import { IsAuthenticatedUseCases } from 'src/usecases/account/isAuthenticated.usecases';
import { LogoutUseCases } from 'src/usecases/account/logout.usecases';
import { JwtModule } from '../services/jwt/jwt.module';
import { BcryptModule } from '../services/bcrypt/bcrypt.module';
import { DeleteUseCases } from 'src/usecases/account/deleteMyAccount.usecases';
import { UpdateAccountUseCases } from 'src/usecases/account/update_account.usecases';
import { CheckExistenceUseCase } from 'src/usecases/utils/checkExistense.usecases';

@Module({
  imports: [
    LoggerModule,
    JwtModule,
    BcryptModule,
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
  static POST_MEDICALHISTORY_USECASES_PROXY = 'postMedicalHistoryUseCasesProxy';
  static POST_MEDICALPROCEDURE_USECASES_PROXY =
    'postMedicalProcedureUseCasesProxy';
  static POST_MESSAGE_USECASES_PROXY = 'postMessageUseCasesProxy';
  static POST_SCHEDULE_USECASES_PROXY = 'postScheduleUseCasesProxy';
  static POST_ACCOUNT_USECASES_PROXY = 'postAccountUseCasesProxy';
  static POST_CONTACTINFO_USECASES_PROXY = 'postContactInfoUseCasesProxy';
  static GET_ACCOUNT_BY_EMAIL_USECASES_PROXY = 'getAccountByEmailUseCasesProxy';
  static LOGIN_USECASES_PROXY = 'LoginUseCasesProxy';
  static IS_AUTHENTICATED_USECASES_PROXY = 'IsAuthenticatedUseCasesProxy';
  static LOGOUT_USECASES_PROXY = 'LogoutUseCasesProxy';
  static DELETE_ACCOUNT_USECASES_PROXY = 'DeleteAccountUseCasesProxy';
  static UPDATE_ACCOUNT_USECASES_PROXY = 'UpdateAccountUseCasesProxy';

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
            checkExistenceUseCase: CheckExistenceUseCase,
          ) =>
            new UseCaseProxy(
              new addDoctorUseCases(
                loggerService,
                databaseDoctorRepository,
                checkExistenceUseCase,
              ),
            ),
        },
        {
          inject: [LoggerService, DatabaseAccountRepository],
          provide: UsecasesProxyModule.GET_ACCOUNT_BY_EMAIL_USECASES_PROXY,
          useFactory: (
            loggerService: LoggerService,
            databaseAccountRepository: DatabaseAccountRepository,
          ) =>
            new UseCaseProxy(
              new getAccountByEmailUseCases(
                loggerService,
                databaseAccountRepository,
              ),
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
            checkExistenceUseCase: CheckExistenceUseCase,
          ) =>
            new UseCaseProxy(
              new addAddressUseCases(
                loggerService,
                databaseAddressRepository,
                checkExistenceUseCase,
              ),
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
        {
          inject: [
            LoggerService,
            JwtTokenService,
            EnvironmentConfigService,
            DatabaseAccountRepository,
            BcryptService,
          ],
          provide: UsecasesProxyModule.POST_ACCOUNT_USECASES_PROXY,
          useFactory: (
            logger: LoggerService,
            jwtTokenService: JwtTokenService,
            config: EnvironmentConfigService,
            userRepo: DatabaseAccountRepository,
            bcryptService: BcryptService,
          ) =>
            new UseCaseProxy(
              new addAccountUseCases(
                logger,
                jwtTokenService,
                config,
                userRepo,
                bcryptService,
              ),
            ),
        },
        {
          inject: [LoggerService, DatabaseContactInfoRepository],
          provide: UsecasesProxyModule.POST_CONTACTINFO_USECASES_PROXY,
          useFactory: (
            loggerService: LoggerService,
            databaseContactInfoRepository: DatabaseContactInfoRepository,
          ) =>
            new UseCaseProxy(
              new addContactInfoUseCases(
                loggerService,
                databaseContactInfoRepository,
              ),
            ),
        },
        {
          inject: [LoggerService, DatabaseMedicalHistoryRepository],
          provide: UsecasesProxyModule.POST_MEDICALHISTORY_USECASES_PROXY,
          useFactory: (
            loggerService: LoggerService,
            databaseMedicalHistoryRepository: DatabaseMedicalHistoryRepository,
          ) =>
            new UseCaseProxy(
              new addMedicalHistoryUseCases(
                loggerService,
                databaseMedicalHistoryRepository,
              ),
            ),
        },
        {
          inject: [LoggerService, DatabaseMedicalProcedureRepository],
          provide: UsecasesProxyModule.POST_MEDICALPROCEDURE_USECASES_PROXY,
          useFactory: (
            loggerService: LoggerService,
            databaseMedicalProcedureRepository: DatabaseMedicalProcedureRepository,
          ) =>
            new UseCaseProxy(
              new addMedicalProcedureUseCases(
                loggerService,
                databaseMedicalProcedureRepository,
              ),
            ),
        },
        {
          inject: [LoggerService, DatabaseScheduleRepository],
          provide: UsecasesProxyModule.POST_SCHEDULE_USECASES_PROXY,
          useFactory: (
            loggerService: LoggerService,
            databaseScheduleRepository: DatabaseScheduleRepository,
          ) =>
            new UseCaseProxy(
              new addScheduleUseCases(
                loggerService,
                databaseScheduleRepository,
              ),
            ),
        },
        {
          inject: [LoggerService, DatabaseMessageRepository],
          provide: UsecasesProxyModule.POST_MESSAGE_USECASES_PROXY,
          useFactory: (
            loggerService: LoggerService,
            databaseMessageRepository: DatabaseMessageRepository,
          ) =>
            new UseCaseProxy(
              new addMessageUseCases(loggerService, databaseMessageRepository),
            ),
        },
        {
          inject: [
            LoggerService,
            JwtTokenService,
            EnvironmentConfigService,
            DatabaseAccountRepository,
            BcryptService,
          ],
          provide: UsecasesProxyModule.LOGIN_USECASES_PROXY,
          useFactory: (
            logger: LoggerService,
            jwtTokenService: JwtTokenService,
            config: EnvironmentConfigService,
            userRepo: DatabaseAccountRepository,
            bcryptService: BcryptService,
          ) =>
            new UseCaseProxy(
              new LoginUseCases(
                logger,
                jwtTokenService,
                config,
                userRepo,
                bcryptService,
              ),
            ),
        },
        {
          inject: [LoggerService, DatabaseAccountRepository],
          provide: UsecasesProxyModule.DELETE_ACCOUNT_USECASES_PROXY,
          useFactory: (
            logger: LoggerService,
            userRepo: DatabaseAccountRepository,
          ) => new UseCaseProxy(new DeleteUseCases(logger, userRepo)),
        },
        {
          inject: [LoggerService, DatabaseAccountRepository],
          provide: UsecasesProxyModule.UPDATE_ACCOUNT_USECASES_PROXY,
          useFactory: (
            logger: LoggerService,
            userRepo: DatabaseAccountRepository,
          ) => new UseCaseProxy(new UpdateAccountUseCases(logger, userRepo)),
        },
        {
          inject: [DatabaseAccountRepository],
          provide: UsecasesProxyModule.IS_AUTHENTICATED_USECASES_PROXY,
          useFactory: (userRepo: DatabaseAccountRepository) =>
            new UseCaseProxy(new IsAuthenticatedUseCases(userRepo)),
        },
        {
          inject: [],
          provide: UsecasesProxyModule.LOGOUT_USECASES_PROXY,
          useFactory: () => new UseCaseProxy(new LogoutUseCases()),
        },
      ],
      exports: [
        UsecasesProxyModule.POST_DOCTOR_USECASES_PROXY,
        UsecasesProxyModule.POST_PATIENT_USECASES_PROXY,
        UsecasesProxyModule.POST_ADDRESS_USECASES_PROXY,
        UsecasesProxyModule.POST_APPOINTMENT_USECASES_PROXY,
        UsecasesProxyModule.POST_ACCOUNT_USECASES_PROXY,
        UsecasesProxyModule.POST_CONTACTINFO_USECASES_PROXY,
        UsecasesProxyModule.POST_MEDICALHISTORY_USECASES_PROXY,
        UsecasesProxyModule.POST_MEDICALPROCEDURE_USECASES_PROXY,
        UsecasesProxyModule.POST_SCHEDULE_USECASES_PROXY,
        UsecasesProxyModule.POST_MESSAGE_USECASES_PROXY,
        UsecasesProxyModule.GET_ACCOUNT_BY_EMAIL_USECASES_PROXY,
        UsecasesProxyModule.LOGIN_USECASES_PROXY,
        UsecasesProxyModule.IS_AUTHENTICATED_USECASES_PROXY,
        UsecasesProxyModule.LOGOUT_USECASES_PROXY,
        UsecasesProxyModule.DELETE_ACCOUNT_USECASES_PROXY,
        UsecasesProxyModule.UPDATE_ACCOUNT_USECASES_PROXY,
      ],
    };
  }
}
