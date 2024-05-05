import { DynamicModule, Module } from '@nestjs/common';
import { LoggerModule } from '../logger/logger.module';
import { EnvironmentConfigModule } from '../config/environment-config/environment-config.module';
import { RepositoriesModule } from '../repositories/repositories.module';
import { ExceptionsModule } from '../exceptions/exceptions.module';
import { LoggerService } from '../logger/logger.service';
import { DatabaseDoctorRepository } from '../repositories/doctor.repository';
import { UseCaseProxy } from './usecases-proxy';
import { addDoctorUseCases } from '../../usecases/doctor/doctor.usecases';
import { DatabasePatientRepository } from '../repositories/patient.repository';
import { addPatientUseCases } from '../../usecases/patient/addPatient.usecases';
import { DatabaseAddressRepository } from '../repositories/address.repository';
import { addAddressUseCases } from '../../usecases/address/addAddress.usecases';
import { DatabaseAccountRepository } from '../repositories/account.repository';
import { addAccountUseCases } from '../../usecases/account/addAccount.usecases';
import { DatabaseContactInfoRepository } from '../repositories/contactInfo.repository';
import { addContactInfoUseCases } from '../../usecases/contactInfo/addContactInfo.usecases';
import { DatabaseMessageRepository } from '../repositories/message.repository';
import { addMessageUseCases } from '../../usecases/message/addMessage.usecases';
import { getAccountByEmailUseCases } from '../../usecases/account/getAccountByEmail.usecases';
import { JwtTokenService } from '../services/jwt/jwt.service';
import { EnvironmentConfigService } from '../config/environment-config/environment-config.service';
import { BcryptService } from '../services/bcrypt/bcrypt.service';
import { LoginUseCases } from '../../usecases/account/login.usecases';
import { IsAuthenticatedUseCases } from '../../usecases/account/isAuthenticated.usecases';
import { LogoutUseCases } from '../../usecases/account/logout.usecases';
import { JwtModule } from '../services/jwt/jwt.module';
import { BcryptModule } from '../services/bcrypt/bcrypt.module';
import { DeleteUseCases } from '../../usecases/account/deleteMyAccount.usecases';
import { UpdateAccountUseCases } from '../../usecases/account/update_account.usecases';
import { EntityValidator } from '../../usecases/utils/checkExistense.usecases';
import { EncryptModule } from '../services/encrypt/encrypt.module';
import { EncryptService } from '../services/encrypt/encrypt.service';
import { GetAccountUseCases } from 'src/usecases/account/getMyAccount.usecases';
import { DatabaseProcedureRepository } from '../repositories/procedure.repository';
import { addProcedureUseCases } from 'src/usecases/procedure/procedure.usecases';

@Module({
  imports: [
    LoggerModule,
    JwtModule,
    BcryptModule,
    EnvironmentConfigModule,
    RepositoriesModule,
    ExceptionsModule,
    EncryptModule,
  ],
})
export class UsecasesProxyModule {
  static POST_DOCTOR_USECASES_PROXY = 'postDoctorUseCasesProxy';
  static GET_ACCOUNT_USECASES_PROXY = 'getAccountUseCasesProxy';
  static POST_PATIENT_USECASES_PROXY = 'postPatientUseCasesProxy';
  static POST_ADDRESS_USECASES_PROXY = 'postAddressUseCasesProxy';
  static POST_MESSAGE_USECASES_PROXY = 'postMessageUseCasesProxy';
  static POST_ACCOUNT_USECASES_PROXY = 'postAccountUseCasesProxy';
  static POST_CONTACTINFO_USECASES_PROXY = 'postContactInfoUseCasesProxy';
  static GET_ACCOUNT_BY_EMAIL_USECASES_PROXY = 'getAccountByEmailUseCasesProxy';
  static LOGIN_USECASES_PROXY = 'LoginUseCasesProxy';
  static IS_AUTHENTICATED_USECASES_PROXY = 'IsAuthenticatedUseCasesProxy';
  static LOGOUT_USECASES_PROXY = 'LogoutUseCasesProxy';
  static DELETE_ACCOUNT_USECASES_PROXY = 'DeleteAccountUseCasesProxy';
  static UPDATE_ACCOUNT_USECASES_PROXY = 'UpdateAccountUseCasesProxy';
  static POST_PROCEDURE_USECASES_PROXY = 'postProcedureUseCasesProxy';

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
              new addDoctorUseCases(
                loggerService,
                databaseDoctorRepository,
                new EntityValidator(databaseDoctorRepository),
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
          inject: [LoggerService, DatabaseAccountRepository],
          provide: UsecasesProxyModule.GET_ACCOUNT_USECASES_PROXY,
          useFactory: (
            loggerService: LoggerService,
            databaseAccountRepository: DatabaseAccountRepository,
          ) =>
            new UseCaseProxy(
              new GetAccountUseCases(loggerService, databaseAccountRepository),
            ),
        },
        {
          inject: [
            LoggerService,
            DatabasePatientRepository,
            DatabaseDoctorRepository,
          ],
          provide: UsecasesProxyModule.POST_PATIENT_USECASES_PROXY,
          useFactory: (
            loggerService: LoggerService,
            databasePatientRepository: DatabasePatientRepository,
            databaseDoctorRepository: DatabaseDoctorRepository,
          ) =>
            new UseCaseProxy(
              new addPatientUseCases(
                loggerService,
                databasePatientRepository,
                databaseDoctorRepository,
                new EntityValidator(databasePatientRepository),
              ),
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
              new addAddressUseCases(
                loggerService,
                databaseAddressRepository,
                new EntityValidator(databaseAddressRepository),
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
                new EntityValidator(databaseContactInfoRepository),
              ),
            ),
        },
        {
          inject: [
            LoggerService,
            DatabaseMessageRepository,
            EncryptService,
            DatabaseAccountRepository,
          ],
          provide: UsecasesProxyModule.POST_MESSAGE_USECASES_PROXY,
          useFactory: (
            loggerService: LoggerService,
            databaseMessageRepository: DatabaseMessageRepository,
            encryptService: EncryptService,
            databaseAccountRepository: DatabaseAccountRepository,
          ) =>
            new UseCaseProxy(
              new addMessageUseCases(
                loggerService,
                databaseMessageRepository,
                encryptService,
                databaseAccountRepository,
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
        {
          inject: [
            LoggerService,
            DatabaseProcedureRepository,
            DatabaseDoctorRepository,
          ],
          provide: UsecasesProxyModule.POST_PROCEDURE_USECASES_PROXY,
          useFactory: (
            loggerService: LoggerService,
            databaseProcedureRepository: DatabaseProcedureRepository,
            databaseDoctorRepository: DatabaseDoctorRepository,
          ) =>
            new UseCaseProxy(
              new addProcedureUseCases(
                loggerService,
                databaseProcedureRepository,
                new EntityValidator(databaseDoctorRepository),
                databaseDoctorRepository,
              ),
            ),
        },
      ],
      exports: [
        UsecasesProxyModule.POST_DOCTOR_USECASES_PROXY,
        UsecasesProxyModule.POST_PATIENT_USECASES_PROXY,
        UsecasesProxyModule.POST_ADDRESS_USECASES_PROXY,
        UsecasesProxyModule.POST_ACCOUNT_USECASES_PROXY,
        UsecasesProxyModule.POST_CONTACTINFO_USECASES_PROXY,
        UsecasesProxyModule.POST_MESSAGE_USECASES_PROXY,
        UsecasesProxyModule.GET_ACCOUNT_BY_EMAIL_USECASES_PROXY,
        UsecasesProxyModule.LOGIN_USECASES_PROXY,
        UsecasesProxyModule.IS_AUTHENTICATED_USECASES_PROXY,
        UsecasesProxyModule.LOGOUT_USECASES_PROXY,
        UsecasesProxyModule.DELETE_ACCOUNT_USECASES_PROXY,
        UsecasesProxyModule.UPDATE_ACCOUNT_USECASES_PROXY,
        UsecasesProxyModule.GET_ACCOUNT_USECASES_PROXY,
        UsecasesProxyModule.POST_PROCEDURE_USECASES_PROXY,
      ],
    };
  }
}
