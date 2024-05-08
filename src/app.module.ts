import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LoggerModule } from './infrastructure/logger/logger.module';
import { ExceptionsModule } from './infrastructure/exceptions/exceptions.module';
import { UsecasesProxyModule } from './infrastructure/usecases-proxy/usecases-proxy.module';
import { ControllersModule } from './infrastructure/controllers/controllers.module';
import { EnvironmentConfigModule } from './infrastructure/config/environment-config/environment-config.module';
import { JwtModule as JwtServiceModule } from './infrastructure/services/jwt/jwt.module';
import { LocalStrategy } from './infrastructure/common/strategies/local.strategy';
import { JwtStrategy } from './infrastructure/common/strategies/jwt.strategies';
import { JwtRefreshTokenStrategy } from './infrastructure/common/strategies/jwtRefresh.strategy';
import { ScheduleModule } from '@nestjs/schedule';
import { DailyProceduresSchedulerStrategy } from './infrastructure/common/strategies/dailyProceduresScheduler.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.secret,
    }),
    ScheduleModule.forRoot(),
    LoggerModule,
    ExceptionsModule,
    UsecasesProxyModule.regiter(),
    ControllersModule,
    EnvironmentConfigModule,
    JwtModule,
    JwtServiceModule,
  ],
  providers: [
    DailyProceduresSchedulerStrategy,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshTokenStrategy,
  ],
})
export class AppModule {}
