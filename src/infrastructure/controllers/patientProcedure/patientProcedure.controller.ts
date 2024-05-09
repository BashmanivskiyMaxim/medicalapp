import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UseCaseProxy } from 'src/infrastructure/usecases-proxy/usecases-proxy';
import { UsecasesProxyModule } from 'src/infrastructure/usecases-proxy/usecases-proxy.module';
import { PatientProcedurePresenter } from './patientProcedure.presenter';
import { JwtAuthGuard } from 'src/infrastructure/common/guards/jwtAuth.guard';
import { addPatientProcedureUseCases } from 'src/usecases/PatientProcedure/patientProcedure.usecases';
import { AddPatientProcedureDto } from './patientProcedure.dto';

@Controller('patientProcedure')
@ApiTags('patientProcedure')
@ApiResponse({ status: 500, description: 'Internal Error' })
@ApiResponse({
  status: 401,
  description: 'No authorization token was found',
})
@ApiExtraModels(PatientProcedurePresenter)
export class PatientProcedureController {
  constructor(
    @Inject(UsecasesProxyModule.POST_PATIENT_PROCEDURE_USECASES_PROXY)
    private readonly addPatientProcedureUseCasesProxy: UseCaseProxy<addPatientProcedureUseCases>,
  ) {}

  @Post('add')
  @ApiBody({ type: AddPatientProcedureDto })
  @ApiResponse({ type: PatientProcedurePresenter })
  @ApiOperation({ description: 'createPatientProcedure' })
  @UseGuards(JwtAuthGuard)
  async addPatientProcedure(
    @Body() addPatientProcedureDto: AddPatientProcedureDto,
    @Request() request: any,
  ) {
    const patientProcedureCreated = await this.addPatientProcedureUseCasesProxy
      .getInstance()
      .add(addPatientProcedureDto, request.user);
    return new PatientProcedurePresenter(patientProcedureCreated);
  }

  @Patch('pickByPatient/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'pick proc by patient' })
  async updatePatientProcedure(
    @Request() request: any,
    @Param('id') id: string,
  ) {
    const patientProcedureUpdated = await this.addPatientProcedureUseCasesProxy
      .getInstance()
      .update(request.user, id);
    return new PatientProcedurePresenter(patientProcedureUpdated);
  }

  @Delete('delete/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'delete' })
  async deletePatientProcedure(
    @Request() request: any,
    @Param('id') id: string,
  ) {
    await this.addPatientProcedureUseCasesProxy
      .getInstance()
      .delete(id, request.user);
    return 'Procedure deleted successfully';
  }

  @Get('get/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'get' })
  async getPatientProcedure(@Param('id') id: string, @Request() request: any) {
    const patientProcedure = await this.addPatientProcedureUseCasesProxy
      .getInstance()
      .getById(id, request.user);
    return new PatientProcedurePresenter(patientProcedure);
  }

  @Get('get')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'get' })
  async getPatientProcedures(@Request() request: any) {
    const patientProcedures = await this.addPatientProcedureUseCasesProxy
      .getInstance()
      .getAll(request.user);
    return patientProcedures.map(
      (patientProcedure) => new PatientProcedurePresenter(patientProcedure),
    );
  }

  @Get('getMyProcedures')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'get' })
  async getMyProcedures(@Request() request: any) {
    const patientProcedures = await this.addPatientProcedureUseCasesProxy
      .getInstance()
      .getMyProcedures(request.user);
    return patientProcedures.map(
      (patientProcedure) => new PatientProcedurePresenter(patientProcedure),
    );
  }

  @Get('getDoctorProcedures')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'get' })
  async getDoctorProcedures(@Request() request: any) {
    const patientProcedures = await this.addPatientProcedureUseCasesProxy
      .getInstance()
      .getDoctorProcedures(request.user);
    return patientProcedures.map(
      (patientProcedure) => new PatientProcedurePresenter(patientProcedure),
    );
  }

  @Patch('rate/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'rate' })
  async rateProcedure(
    @Request() request: any,
    @Param('id') id: string,
    @Body() rating: number,
  ) {
    const patientProcedure = await this.addPatientProcedureUseCasesProxy
      .getInstance()
      .rateProcedure(id, rating, request.user);
    return new PatientProcedurePresenter(patientProcedure);
  }

  @Patch('report/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'report' })
  async reportProcedure(
    @Request() request: any,
    @Param('id') id: string,
    @Body() report: object,
  ) {
    const patientProcedure = await this.addPatientProcedureUseCasesProxy
      .getInstance()
      .reportProcedure(id, report, request.user);
    return new PatientProcedurePresenter(patientProcedure);
  }
}
