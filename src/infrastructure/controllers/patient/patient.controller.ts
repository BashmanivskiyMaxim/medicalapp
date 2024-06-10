import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Patch,
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
  async addPatient(@Body() addPatientDto: AddPatientDto) {
    const patientCreated = await this.addPatientUseCasesProxy
      .getInstance()
      .execute(addPatientDto);
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

  @Patch('update/:patientId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'Update patient' })
  async updatePatient(@Req() request: any, @Body() additionalInfo: object) {
    await this.addPatientUseCasesProxy
      .getInstance()
      .updatePatient(request.user, additionalInfo);
    return 'Update successful';
  }

  @Get('getMyPatientInfo')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'getMyPatientInfo' })
  async getMyPatientInfo(@Req() request: any) {
    const patient = await this.addPatientUseCasesProxy
      .getInstance()
      .getMyPatientInfo(request.user);
    return patient;
  }
}
