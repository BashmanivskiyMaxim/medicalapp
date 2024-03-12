import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
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

  @Post('add')
  @ApiResponse({ type: PatientPresenter })
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'createPatient' })
  async addPatient(@Body() addPatientDto: AddPatientDto, @Req() request: any) {
    const patientCreated = await this.addPatientUseCasesProxy
      .getInstance()
      .execute(addPatientDto, request.user);
    return new PatientPresenter(patientCreated);
  }

  @Delete('delete/:patientId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'deletePatient' })
  async deleteDoctor(@Req() request: any) {
    await this.addPatientUseCasesProxy
      .getInstance()
      .deletePatient(request.user, request.params.patientId);
    return 'Delete successful';
  }

  @Get('get')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'getPatients' })
  async getPatients(@Req() request: any) {
    const patients = await this.addPatientUseCasesProxy
      .getInstance()
      .getPatients(request.user);
    return patients;
  }
}
