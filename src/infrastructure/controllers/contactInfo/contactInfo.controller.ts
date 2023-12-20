import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsecasesProxyModule } from 'src/infrastructure/usecases-proxy/usecases-proxy.module';
import { UseCaseProxy } from 'src/infrastructure/usecases-proxy/usecases-proxy';
import { ContactInfoPresenter } from './contactInfo.presenter';
import { addContactInfoUseCases } from 'src/usecases/contactInfo/addContactInfo.usecases';
import { AddContactInfoDto } from './contactInfo.dto';

@Controller('contactInfo')
@ApiTags('contactInfo')
@ApiResponse({ status: 500, description: 'Internal Error' })
@ApiExtraModels(ContactInfoPresenter)
export class ContactInfoController {
  constructor(
    @Inject(UsecasesProxyModule.POST_CONTACTINFO_USECASES_PROXY)
    private readonly addContactInfoUseCasesProxy: UseCaseProxy<addContactInfoUseCases>,
  ) {}

  @Post('contactInfo')
  @ApiResponse({ type: ContactInfoPresenter })
  async addcontactInfo(@Body() addcontactInfoDto: AddContactInfoDto) {
    const contactInfoCreated = await this.addContactInfoUseCasesProxy
      .getInstance()
      .execute(addcontactInfoDto);
    return new ContactInfoPresenter(contactInfoCreated);
  }
}
