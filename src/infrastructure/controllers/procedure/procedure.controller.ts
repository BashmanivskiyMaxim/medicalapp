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
import { AddProcedureDto } from './procedure.dto';

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
    const procedureCreated = await this.addProcedureUseCasesProxy
      .getInstance()
      .add(addProcedureDto, request.user);
    return new ProcedurePresenter(procedureCreated);
  }

  @Patch('update/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'update' })
  async updateProcedure(
    @Request() request: any,
    @Body() updateDto: AddProcedureDto,
    @Param('id') id: string,
  ) {
    const procedureUpdated = await this.addProcedureUseCasesProxy
      .getInstance()
      .update(updateDto, request.user, id);
    return new ProcedurePresenter(procedureUpdated);
  }

  @Delete('delete/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'delete' })
  async deleteProcedure(@Param('id') id: string, @Request() request: any) {
    await this.addProcedureUseCasesProxy.getInstance().delete(id, request.user);
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
    return procedures.map((procedure) => new ProcedurePresenter(procedure));
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
}
