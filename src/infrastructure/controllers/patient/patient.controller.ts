import { Controller, Inject, Post, Request, UseGuards } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PatientPresenter } from './patient.presenter';
import { UsecasesProxyModule } from 'src/infrastructure/usecases-proxy/usecases-proxy.module';
import { UseCaseProxy } from 'src/infrastructure/usecases-proxy/usecases-proxy';
import { addPatientUseCases } from 'src/usecases/patient/addPatient.usecases';
import { JwtAuthGuard } from 'src/infrastructure/common/guards/jwtAuth.guard';

@Controller('patient')
@ApiTags('patient')
@ApiResponse({ status: 500, description: 'Internal Error' })
@ApiExtraModels(PatientPresenter)
export class PatientController {
  constructor(
    @Inject(UsecasesProxyModule.POST_PATIENT_USECASES_PROXY)
    private readonly addPatientUseCasesProxy: UseCaseProxy<addPatientUseCases>,
  ) {}

  @Post('add/:accountId')
  @ApiResponse({ type: PatientPresenter })
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'createPatient' })
  async addPatient(@Request() request: any) {
    const patientCreated = await this.addPatientUseCasesProxy
      .getInstance()
      .execute(request.user, +request.params.accountId);
    return new PatientPresenter(patientCreated);
  }
}
