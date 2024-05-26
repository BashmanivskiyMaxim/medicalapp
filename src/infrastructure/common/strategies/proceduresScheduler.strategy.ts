import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LoggerService } from 'src/infrastructure/logger/logger.service';
import { addPatientProcedureUseCases } from 'src/usecases/PatientProcedure/patientProcedure.usecases';
import { UsecasesProxyModule } from '../../usecases-proxy/usecases-proxy.module';
import { UseCaseProxy } from '../../usecases-proxy/usecases-proxy';

@Injectable()
export class DailyProceduresSchedulerStrategy {
  constructor(
    @Inject(UsecasesProxyModule.POST_PATIENT_PROCEDURE_USECASES_PROXY)
    private readonly patientProcedureUsecaseProxy: UseCaseProxy<addPatientProcedureUseCases>,
    private readonly logger: LoggerService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCronSchedule() {
    try {
      this.logger.log(
        'DailyProceduresSchedulerStrategy',
        'Daily schedule procedure',
      );
      this.patientProcedureUsecaseProxy.getInstance().dailyScheduleProcedure();
    } catch (error) {
      this.logger.error('DailyProceduresScheduler', error);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_11PM)
  async handleCronDelete() {
    try {
      this.logger.log(
        'proceduresDeleteSchedulerStrategy',
        'schedule procedure deleted',
      );
      this.patientProcedureUsecaseProxy.getInstance().scheduleDeleteProcedure();
    } catch (error) {
      this.logger.error('proceduresDeleteScheduler', error);
    }
  }
}
