import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsecasesProxyModule } from 'src/infrastructure/usecases-proxy/usecases-proxy.module';
import { UseCaseProxy } from 'src/infrastructure/usecases-proxy/usecases-proxy';
import { DoctorPresenter } from './doctor.presenter';
import { addDoctorUseCases } from 'src/usecases/doctor/addDoctor.usecases';
import { AddDoctorDto } from './doctor.dto';

@Controller('doctor')
@ApiTags('doctor')
@ApiResponse({ status: 500, description: 'Internal Error' })
@ApiExtraModels(DoctorPresenter)
export class DoctorController {
  constructor(
    @Inject(UsecasesProxyModule.POST_DOCTOR_USECASES_PROXY)
    private readonly addDoctorUseCasesProxy: UseCaseProxy<addDoctorUseCases>,
  ) {}

  @Post('doctor')
  @ApiResponse({ type: DoctorPresenter })
  async addDoctor(@Body() addDoctorDto: AddDoctorDto) {
    const doctorCreated = await this.addDoctorUseCasesProxy
      .getInstance()
      .execute(addDoctorDto);
    return new DoctorPresenter(doctorCreated);
  }
}
