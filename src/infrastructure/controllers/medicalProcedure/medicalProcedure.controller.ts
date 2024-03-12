import {
  Body,
  Controller,
  Inject,
  Post,
  UseGuards,
  //Request,
} from '@nestjs/common';
import {
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UsecasesProxyModule } from 'src/infrastructure/usecases-proxy/usecases-proxy.module';
import { UseCaseProxy } from 'src/infrastructure/usecases-proxy/usecases-proxy';
import { MedicalProcedurePresenter } from './medicalProcedure.presenter';
import { AddMedicalProcedureDto } from './medicalProcedure.dto';
import { addMedicalProcedureUseCases } from 'src/usecases/medicalProcedure/addMedicalProcedure.usecases';
import { JwtAuthGuard } from 'src/infrastructure/common/guards/jwtAuth.guard';

@Controller('medicalProcedure')
@ApiTags('medicalProcedure')
@ApiResponse({ status: 500, description: 'Internal Error' })
@ApiResponse({
  status: 401,
  description: 'No authorization token was found',
})
@ApiExtraModels(MedicalProcedurePresenter)
export class MedicalProcedureController {
  constructor(
    @Inject(UsecasesProxyModule.POST_MEDICALPROCEDURE_USECASES_PROXY)
    private readonly addMedicalProcedureUseCasesProxy: UseCaseProxy<addMedicalProcedureUseCases>,
  ) {}

  @Post('add')
  @ApiBody({ type: AddMedicalProcedureDto })
  @ApiResponse({ type: MedicalProcedurePresenter })
  @ApiOperation({ description: 'create medical procedure' })
  @UseGuards(JwtAuthGuard)
  async addmedicalProcedure(
    @Body() addmedicalProcedureDto: AddMedicalProcedureDto,
    //@Request() request: any,
  ) {
    const medicalProcedureCreated = await this.addMedicalProcedureUseCasesProxy
      .getInstance()
      .execute(addmedicalProcedureDto);
    return new MedicalProcedurePresenter(medicalProcedureCreated);
  }
}
