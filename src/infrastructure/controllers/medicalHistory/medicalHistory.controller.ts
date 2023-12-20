import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsecasesProxyModule } from 'src/infrastructure/usecases-proxy/usecases-proxy.module';
import { UseCaseProxy } from 'src/infrastructure/usecases-proxy/usecases-proxy';
import { MedicalHistoryPresenter } from './medicalHistory.presenter';
import { addMedicalHistoryUseCases } from 'src/usecases/medicalHistory/addMedicalHistory.usecases';
import { AddMedicalHistoryDto } from './medicalHistory.dto';

@Controller('medicalHistory')
@ApiTags('medicalHistory')
@ApiResponse({ status: 500, description: 'Internal Error' })
@ApiExtraModels(MedicalHistoryPresenter)
export class MedicalHistoryController {
  constructor(
    @Inject(UsecasesProxyModule.POST_MEDICALHISTORY_USECASES_PROXY)
    private readonly addMedicalHistoryUseCasesProxy: UseCaseProxy<addMedicalHistoryUseCases>,
  ) {}

  @Post('medicalHistory')
  @ApiResponse({ type: MedicalHistoryPresenter })
  async addmedicalHistory(@Body() addmedicalHistoryDto: AddMedicalHistoryDto) {
    const medicalHistoryCreated = await this.addMedicalHistoryUseCasesProxy
      .getInstance()
      .execute(addmedicalHistoryDto);
    return new MedicalHistoryPresenter(medicalHistoryCreated);
  }
}
