import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsecasesProxyModule } from 'src/infrastructure/usecases-proxy/usecases-proxy.module';
import { UseCaseProxy } from 'src/infrastructure/usecases-proxy/usecases-proxy';
import { addAppointmentUseCases } from 'src/usecases/appointment/addappointment.usecases';
import { AppointmentPresenter } from './appointment.presenter';
import { AddAppointmentDto } from './appointment.dto';

@Controller('appointment')
@ApiTags('appointment')
@ApiResponse({ status: 500, description: 'Internal Error' })
@ApiExtraModels(AppointmentPresenter)
export class AppointmentController {
  constructor(
    @Inject(UsecasesProxyModule.POST_APPOINTMENT_USECASES_PROXY)
    private readonly addAppointmentUseCasesProxy: UseCaseProxy<addAppointmentUseCases>,
  ) {}

  @Post('appointment')
  @ApiResponse({ type: AppointmentPresenter })
  async addappointment(@Body() addappointmentDto: AddAppointmentDto) {
    const appointmentCreated = await this.addAppointmentUseCasesProxy
      .getInstance()
      .execute(addappointmentDto);
    return new AppointmentPresenter(appointmentCreated);
  }
}
