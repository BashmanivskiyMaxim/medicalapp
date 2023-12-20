import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsecasesProxyModule } from 'src/infrastructure/usecases-proxy/usecases-proxy.module';
import { UseCaseProxy } from 'src/infrastructure/usecases-proxy/usecases-proxy';
import { addScheduleUseCases } from 'src/usecases/schedule/addSchedule.usecases';
import { SchedulePresenter } from './schedule.presenter';
import { AddScheduleDto } from './schedule.dto';

@Controller('schedule')
@ApiTags('schedule')
@ApiResponse({ status: 500, description: 'Internal Error' })
@ApiExtraModels(SchedulePresenter)
export class ScheduleController {
  constructor(
    @Inject(UsecasesProxyModule.POST_SCHEDULE_USECASES_PROXY)
    private readonly addScheduleUseCasesProxy: UseCaseProxy<addScheduleUseCases>,
  ) {}

  @Post('schedule')
  @ApiResponse({ type: SchedulePresenter })
  async addschedulet(@Body() addscheduleDto: AddScheduleDto) {
    const scheduleCreated = await this.addScheduleUseCasesProxy
      .getInstance()
      .execute(addscheduleDto);
    return new SchedulePresenter(scheduleCreated);
  }
}
