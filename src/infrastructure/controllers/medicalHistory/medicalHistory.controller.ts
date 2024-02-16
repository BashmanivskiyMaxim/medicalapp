import {
  Body,
  Controller,
  Inject,
  Post,
  UseGuards,
  Request,
  Patch,
  Param,
  Delete,
  Get,
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
import { MedicalHistoryPresenter } from './medicalHistory.presenter';
import { addMedicalHistoryUseCases } from 'src/usecases/medicalHistory/addMedicalHistory.usecases';
import { AddMedicalHistoryDto } from './medicalHistory.dto';
import { JwtAuthGuard } from 'src/infrastructure/common/guards/jwtAuth.guard';

@Controller('medical_history')
@ApiTags('medical_history')
@ApiResponse({ status: 500, description: 'Internal Error' })
@ApiResponse({
  status: 401,
  description: 'No authorization token was found',
})
@ApiExtraModels(MedicalHistoryPresenter)
export class MedicalHistoryController {
  constructor(
    @Inject(UsecasesProxyModule.POST_MEDICALHISTORY_USECASES_PROXY)
    private readonly addMedicalHistoryUseCasesProxy: UseCaseProxy<addMedicalHistoryUseCases>,
  ) {}

  @Post('add')
  @ApiBody({ type: AddMedicalHistoryDto })
  @ApiResponse({ type: MedicalHistoryPresenter })
  @ApiOperation({ description: 'create medical history' })
  @UseGuards(JwtAuthGuard)
  async addmedicalHistory(
    @Body() addmedicalHistoryDto: AddMedicalHistoryDto,
    @Request() request: any,
  ) {
    const medicalHistoryCreated = await this.addMedicalHistoryUseCasesProxy
      .getInstance()
      .execute(addmedicalHistoryDto, request.user);
    return new MedicalHistoryPresenter(medicalHistoryCreated);
  }

  @Patch('update/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'update' })
  async updateDoctor(
    @Request() request: any,
    @Body() updateDto: AddMedicalHistoryDto,
    @Param('id') id: string,
  ) {
    await this.addMedicalHistoryUseCasesProxy
      .getInstance()
      .updateMedicalHistory(+id, updateDto, request.user);
    return 'Update successful';
  }

  @Delete('delete/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'delete medical history' })
  async deleteMedicalHistory(@Request() request: any, @Param('id') id: string) {
    await this.addMedicalHistoryUseCasesProxy
      .getInstance()
      .deleteMedicalHistory(+id, request.user);
    return 'Delete successful';
  }

  @Get('get')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'get all medical history' })
  async getMedicalHistory(@Request() request: any) {
    const medicalHistory = await this.addMedicalHistoryUseCasesProxy
      .getInstance()
      .getAllMedicalHistory(request.user);
    return medicalHistory;
  }

  @Get('get/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'get medical history by id' })
  async getMedicalHistoryById(
    @Request() request: any,
    @Param('id') id: string,
  ) {
    const medicalHistory = await this.addMedicalHistoryUseCasesProxy
      .getInstance()
      .getMedicalHistoryById(+id, request.user);
    return medicalHistory;
  }
}
