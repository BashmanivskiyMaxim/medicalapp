import {
  Body,
  Controller,
  Inject,
  Post,
  UseGuards,
  Request,
  Patch,
  Param,
  Get,
  Delete,
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
import { JwtAuthGuard } from 'src/infrastructure/common/guards/jwtAuth.guard';
import { ProcedurePresenter } from './procedure.presenter';
import { addProcedureUseCases } from 'src/usecases/procedure/procedure.usecases';
import { AddProcedureDto, UpdateProcedureDto } from './procedure.dto';

@Controller('procedure')
@ApiTags('procedure')
@ApiResponse({ status: 500, description: 'Internal Error' })
@ApiResponse({
  status: 401,
  description: 'No authorization token was found',
})
@ApiExtraModels(ProcedurePresenter)
export class ProcedureController {
  constructor(
    @Inject(UsecasesProxyModule.POST_PROCEDURE_USECASES_PROXY)
    private readonly addProcedureUseCasesProxy: UseCaseProxy<addProcedureUseCases>,
  ) {}

  @Post('add')
  @ApiBody({ type: AddProcedureDto })
  @ApiResponse({ type: ProcedurePresenter })
  @ApiOperation({ description: 'createProcedure' })
  @UseGuards(JwtAuthGuard)
  async addProcedure(
    @Body() addProcedureDto: AddProcedureDto,
    @Request() request: any,
  ) {
    console.log('addProcedureDto', addProcedureDto);
    const procedureCreated = await this.addProcedureUseCasesProxy
      .getInstance()
      .add(addProcedureDto, request.user);
    return new ProcedurePresenter(procedureCreated);
  }

  @Patch('update/:id')
  @ApiBody({ type: UpdateProcedureDto })
  @ApiResponse({ type: ProcedurePresenter })
  @ApiOperation({ description: 'updateProcedure' })
  @UseGuards(JwtAuthGuard)
  async updateProcedure(
    @Param('id') id: string,
    @Body() updateProcedureDto: UpdateProcedureDto,
    @Request() request: any,
  ) {
    const updatedProcedure = await this.addProcedureUseCasesProxy
      .getInstance()
      .update(
        updateProcedureDto,
        request.user,
        +updateProcedureDto.doctorId,
        id,
      );
    return new ProcedurePresenter(updatedProcedure);
  }

  @Delete('delete/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'delete' })
  async deleteProcedure(
    @Param('id') id: string,
    @Request() request: any,
    @Body() body: { doctorId: number },
  ) {
    const { doctorId } = body;
    await this.addProcedureUseCasesProxy
      .getInstance()
      .delete(id, request.user, doctorId);
    return 'Procedure deleted successfully';
  }

  @Get('get/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'get' })
  async getProcedure(@Param('id') id: string) {
    const procedure = await this.addProcedureUseCasesProxy
      .getInstance()
      .getById(id);
    return new ProcedurePresenter(procedure);
  }

  @Get('get')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'get' })
  async getProcedures() {
    const procedures = await this.addProcedureUseCasesProxy
      .getInstance()
      .getAll();
    const proceduresWithDoctor = await this.addProcedureUseCasesProxy
      .getInstance()
      .getProceduresWithDoctor(procedures);
    return proceduresWithDoctor.map(
      (proceduresWithDoctor) => new ProcedurePresenter(proceduresWithDoctor),
    );
  }

  @Patch('rate/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'rate' })
  async rateProcedure(@Param('id') id: string, @Request() request: any) {
    const procedureRated = await this.addProcedureUseCasesProxy
      .getInstance()
      .rate(id, request.user);
    return new ProcedurePresenter(procedureRated);
  }

  @Get('getDoctorProcedures')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'getDoctorProcedures' })
  async getDoctorProcedures(@Request() request: any) {
    const procedures = await this.addProcedureUseCasesProxy
      .getInstance()
      .getDoctorProcedures(request.user);
    return procedures.map((procedure) => new ProcedurePresenter(procedure));
  }
}
