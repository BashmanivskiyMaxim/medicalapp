import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsecasesProxyModule } from 'src/infrastructure/usecases-proxy/usecases-proxy.module';
import { UseCaseProxy } from 'src/infrastructure/usecases-proxy/usecases-proxy';
import { AccountPresenter } from './account.presenter';
import { addAccountUseCases } from 'src/usecases/account/addAccount.usecases';
import { AddAccountDto } from './account.dto';

@Controller('account')
@ApiTags('account')
@ApiResponse({ status: 500, description: 'Internal Error' })
@ApiExtraModels(AccountPresenter)
export class AccountController {
  constructor(
    @Inject(UsecasesProxyModule.POST_ACCOUNT_USECASES_PROXY)
    private readonly addAccountUseCasesProxy: UseCaseProxy<addAccountUseCases>,
  ) {}

  @Post('account')
  @ApiResponse({ type: AccountPresenter })
  async addaccount(@Body() addaddressDto: AddAccountDto) {
    const addressCreated = await this.addAccountUseCasesProxy
      .getInstance()
      .execute(addaddressDto);
    return new AccountPresenter(addressCreated);
  }
}
