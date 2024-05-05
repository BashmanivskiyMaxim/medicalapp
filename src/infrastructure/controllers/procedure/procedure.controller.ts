import {
  Body,
  Controller,
  Inject,
  Post,
  UseGuards,
  Request,
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
}
