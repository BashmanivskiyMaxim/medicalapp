import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PatientPresenter } from './patient.presenter';
import { UsecasesProxyModule } from 'src/infrastructure/usecases-proxy/usecases-proxy.module';
import { UseCaseProxy } from 'src/infrastructure/usecases-proxy/usecases-proxy';
import { addPatientUseCases } from 'src/usecases/patient/addPatient.usecases';
import { AddPatientDto } from './patient.dto';

@Controller('patient')
@ApiTags('patient')
@ApiResponse({ status: 500, description: 'Internal Error' })
@ApiExtraModels(PatientPresenter)
export class PatientController {
  constructor(
    @Inject(UsecasesProxyModule.POST_PATIENT_USECASES_PROXY)
    private readonly addPatientUseCasesProxy: UseCaseProxy<addPatientUseCases>,
  ) {}

  @Post('patient')
  @ApiResponse({ type: PatientPresenter })
  async addPatient(@Body() addPatientDto: AddPatientDto) {
    const patientCreated = await this.addPatientUseCasesProxy
      .getInstance()
      .execute(addPatientDto);
    return new PatientPresenter(patientCreated);
  }
}
