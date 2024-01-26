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
import { ContactInfoPresenter } from './contactInfo.presenter';
import { addContactInfoUseCases } from 'src/usecases/contactInfo/addContactInfo.usecases';
import { AddContactInfoDto } from './contactInfo.dto';
import { JwtAuthGuard } from 'src/infrastructure/common/guards/jwtAuth.guard';

@Controller('contactInfo')
@ApiTags('contactInfo')
@ApiResponse({ status: 500, description: 'Internal Error' })
@ApiResponse({
  status: 401,
  description: 'No authorization token was found',
})
@ApiExtraModels(ContactInfoPresenter)
export class ContactInfoController {
  constructor(
    @Inject(UsecasesProxyModule.POST_CONTACTINFO_USECASES_PROXY)
    private readonly addContactInfoUseCasesProxy: UseCaseProxy<addContactInfoUseCases>,
  ) {}

  @Post('add')
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: AddContactInfoDto })
  @ApiOperation({ description: 'add contact info' })
  @ApiResponse({ type: ContactInfoPresenter })
  async addcontactInfo(
    @Body() addcontactInfoDto: AddContactInfoDto,
    @Request() request: any,
  ) {
    const contactInfoCreated = await this.addContactInfoUseCasesProxy
      .getInstance()
      .execute(addcontactInfoDto, request.user.id);
    return new ContactInfoPresenter(contactInfoCreated);
  }

  @Patch('update')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'update' })
  async updateContactInfo(
    @Req() request: any,
    @Body() updateDto: AddContactInfoDto,
  ) {
    await this.addContactInfoUseCasesProxy
      .getInstance()
      .updateContactInfo(updateDto, request.user.id);
    return 'Update successful';
  }

  @Delete('delete')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'delete' })
  async deleteContactInfo(@Req() request: any) {
    await this.addContactInfoUseCasesProxy
      .getInstance()
      .deleteContactInfo(request.user.id);
    return 'Delete successful';
  }

  @Get('get')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'get' })
  async getContactInfo(@Req() request: any) {
    const contactInfo = await this.addContactInfoUseCasesProxy
      .getInstance()
      .getAllContactInfo(request.user.accountType);
    return contactInfo;
  }
}
