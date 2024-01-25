import {
  Body,
  Controller,
  Inject,
  Post,
  UseGuards,
  Request,
  Patch,
  Req,
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
import { DoctorPresenter } from './doctor.presenter';
import { addDoctorUseCases } from 'src/usecases/doctor/doctor.usecases';
import { AddDoctorDto } from './doctor.dto';
import { JwtAuthGuard } from 'src/infrastructure/common/guards/jwtAuth.guard';

@Controller('doctor')
@ApiTags('doctor')
@ApiResponse({ status: 500, description: 'Internal Error' })
@ApiResponse({
  status: 401,
  description: 'No authorization token was found',
})
@ApiExtraModels(DoctorPresenter)
export class DoctorController {
  constructor(
    @Inject(UsecasesProxyModule.POST_DOCTOR_USECASES_PROXY)
    private readonly addDoctorUseCasesProxy: UseCaseProxy<addDoctorUseCases>,
  ) {}

  @Post('add')
  @ApiBody({ type: AddDoctorDto })
  @ApiResponse({ type: DoctorPresenter })
  @ApiOperation({ description: 'createdoctor' })
  @UseGuards(JwtAuthGuard)
  async addDoctor(@Body() addDoctorDto: AddDoctorDto, @Request() request: any) {
    const doctorCreated = await this.addDoctorUseCasesProxy
      .getInstance()
      .execute(addDoctorDto, request.user);
    return new DoctorPresenter(doctorCreated);
  }

  @Patch('update')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'update' })
  async updateDoctor(@Req() request: any, @Body() updateDto: AddDoctorDto) {
    await this.addDoctorUseCasesProxy
      .getInstance()
      .checkExistence(request.user.id);
    await this.addDoctorUseCasesProxy
      .getInstance()
      .updateDoctorInfo(updateDto, request.user);
    return 'Update successful';
  }

  @Delete('delete')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'delete' })
  async deleteDoctor(@Req() request: any) {
    await this.addDoctorUseCasesProxy.getInstance().deleteDoctor(request.user);
    return 'Delete successful';
  }

  @Get('get')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'get' })
  async getContactInfo(@Req() request: any) {
    const contactInfo = await this.addDoctorUseCasesProxy
      .getInstance()
      .getDoctors(request.user.accountType);
    return contactInfo;
  }
}
