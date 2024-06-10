import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
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
import {
  PatientProcedureForDoctorPresenter,
  PatientProcedureForPatientPresenter,
  PatientProcedurePickPresenter,
  PatientProcedurePresenter,
  PatientProcedureTimesPresenter,
  ReportPresenter,
} from './patientProcedure.presenter';
import { JwtAuthGuard } from 'src/infrastructure/common/guards/jwtAuth.guard';
import { addPatientProcedureUseCases } from 'src/usecases/PatientProcedure/patientProcedure.usecases';
import { AddPatientProcedureDto, RatingDto } from './patientProcedure.dto';

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
    return new PatientProcedurePickPresenter(patientProcedureUpdated);
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
      (patientProcedure) =>
        new PatientProcedureForPatientPresenter(patientProcedure),
    );
  }

  @Get('getTodayPatientProcedures/:id')
  //@UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'get' })
  async getTodayPatientProcedures(@Param('id') id: string) {
    const patientProcedures = await this.addPatientProcedureUseCasesProxy
      .getInstance()
      .getTodayPatientProcedures(+id);

    return patientProcedures.map(
      (patientProcedure) =>
        new PatientProcedureTimesPresenter(patientProcedure),
    );
  }

  @Get('getDoctorProcedures')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'Get doctor procedures with pagination' })
  async getDoctorProcedures(
    @Request() request: any,
    @Query('category') category: 'past' | 'today' | 'future',
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
  ) {
    try {
      const patientProcedures = await this.addPatientProcedureUseCasesProxy
        .getInstance()
        .getDoctorProcedures(request.user, category, page, pageSize);

      const combinedProcedures = patientProcedures.doctorProcedures.map(
        (patientProcedure) =>
          new PatientProcedureForDoctorPresenter(patientProcedure),
      );

      return {
        data: combinedProcedures,
        total: patientProcedures.total,
      };
    } catch (error) {
      console.error('Error fetching doctor procedures:', error);
      throw error;
    }
  }

  @Get('getPatientInfo/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'get' })
  async getPatientInfo(@Param('id') id: string, @Request() request: any) {
    const patientInfo = await this.addPatientProcedureUseCasesProxy
      .getInstance()
      .getPatientInfoByProcedureId(+id, request.user);
    return patientInfo;
  }

  @Get('searchProcedures')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'search doctor procedures' })
  async searchProcedures(
    @Query('keyword') keyword: string,
    @Request() request: any,
  ) {
    const procedures = await this.addPatientProcedureUseCasesProxy
      .getInstance()
      .searchProcedures(keyword, request.user);

    console.log('Procedures:', procedures.data);
    if (!procedures) {
      return {
        data: [],
        total: 0,
      };
    }
    return {
      data: procedures.data.map(
        (patientProcedure) =>
          new PatientProcedureForDoctorPresenter(patientProcedure),
      ),
      total: procedures.total,
    };
  }

  @Patch('rate/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'rate' })
  async rateProcedure(
    @Request() request: any,
    @Param('id') id: string,
    @Body() rating: RatingDto,
  ) {
    const patientProcedure = await this.addPatientProcedureUseCasesProxy
      .getInstance()
      .rateProcedure(id, rating.rating, request.user);
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

  @Get('getReport/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'get' })
  async getReport(@Param('id') id: string, @Request() request: any) {
    const patientProcedureReport = await this.addPatientProcedureUseCasesProxy
      .getInstance()
      .getReport(id, request.user);
    return new ReportPresenter(patientProcedureReport);
  }

  @Get('todayProcedures/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'get' })
  async getProceduresByDate(
    @Param('id') id: string,
    @Query('date') date: string,
  ) {
    if (!date) {
      throw new BadRequestException('Date query parameter is required');
    }

    const patientProcedures = await this.addPatientProcedureUseCasesProxy
      .getInstance()
      .getProceduresByDate(+id, date);
    return patientProcedures.map(
      (patientProcedure) =>
        new PatientProcedureTimesPresenter(patientProcedure),
    );
  }

  @Patch('cancel/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'cancel' })
  async cancelProcedure(@Request() request: any, @Param('id') id: string) {
    await this.addPatientProcedureUseCasesProxy
      .getInstance()
      .cancelProcedure(id, request.user);
    return 'Procedure canceled successfully';
  }

  @Patch('scheduleMyDay')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'schedule' })
  async scheduleMyDay(@Request() request: any) {
    await this.addPatientProcedureUseCasesProxy
      .getInstance()
      .scheduleMyDay(request.user);
    return 'Day scheduled successfully';
  }
}
