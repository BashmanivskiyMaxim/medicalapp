import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsecasesProxyModule } from 'src/infrastructure/usecases-proxy/usecases-proxy.module';
import { UseCaseProxy } from 'src/infrastructure/usecases-proxy/usecases-proxy';
import { MedicalProcedurePresenter } from './medicalProcedure.presenter';
import { AddMedicalProcedureDto } from './medicalProcedure.dto';
import { addMedicalProcedureUseCases } from 'src/usecases/medicalProcedure/addMedicalProcedure.usecases';

@Controller('medicalProcedure')
@ApiTags('medicalProcedure')
@ApiResponse({ status: 500, description: 'Internal Error' })
@ApiExtraModels(MedicalProcedurePresenter)
export class MedicalProcedureController {
  constructor(
    @Inject(UsecasesProxyModule.POST_MEDICALPROCEDURE_USECASES_PROXY)
    private readonly addMedicalProcedureUseCasesProxy: UseCaseProxy<addMedicalProcedureUseCases>,
  ) {}

  @Post('medicalProcedure')
  @ApiResponse({ type: MedicalProcedurePresenter })
  async addmedicalProcedure(
    @Body() addmedicalProcedureDto: AddMedicalProcedureDto,
  ) {
    const medicalProcedureCreated = await this.addMedicalProcedureUseCasesProxy
      .getInstance()
      .execute(addmedicalProcedureDto);
    return new MedicalProcedurePresenter(medicalProcedureCreated);
  }
}
