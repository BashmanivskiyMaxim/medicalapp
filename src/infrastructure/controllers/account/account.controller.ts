import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsecasesProxyModule } from 'src/infrastructure/usecases-proxy/usecases-proxy.module';
import { UseCaseProxy } from 'src/infrastructure/usecases-proxy/usecases-proxy';
import { AccountPresenter } from './account.presenter';
import { addAccountUseCases } from 'src/usecases/account/addAccount.usecases';
import { AddAccountDto } from './account.dto';
import { getAccountByEmailUseCases } from '../../../usecases/account/getAccountByEmail.usecases';

@Controller('account')
@ApiTags('account')
@ApiResponse({ status: 500, description: 'Internal Error' })
@ApiExtraModels(AccountPresenter)
export class AccountController {
  constructor(
    @Inject(UsecasesProxyModule.POST_ACCOUNT_USECASES_PROXY)
    private readonly addAccountUseCasesProxy: UseCaseProxy<addAccountUseCases>,
    @Inject(UsecasesProxyModule.GET_ACCOUNT_BY_EMAIL_USECASES_PROXY)
    private readonly getAccountByEmailUseCasesProxy: UseCaseProxy<getAccountByEmailUseCases>,
  ) {}

  @Post('account')
  @ApiResponse({ type: AccountPresenter })
  async addaccount(@Body() addaccountDto: AddAccountDto) {
    const accountCreated = await this.addAccountUseCasesProxy
      .getInstance()
      .execute(addaccountDto);
    return new AccountPresenter(accountCreated);
  }

  @Get('account')
  @ApiResponse({ type: AccountPresenter })
  async getaccount(@Body() addaccountDto: AddAccountDto) {
    const addressCreated = await this.getAccountByEmailUseCasesProxy
      .getInstance()
      .execute(addaccountDto);
    return new AccountPresenter(addressCreated);
  }
}
