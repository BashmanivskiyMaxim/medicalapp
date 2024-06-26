import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Req,
  Request,
  UseGuards,
  Delete,
  Patch,
  Param,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { AuthLoginDto } from './auth-dto.class';
import { IsAuthPresenter } from './auth.presenter';

import { UseCaseProxy } from '../../usecases-proxy/usecases-proxy';
import { UsecasesProxyModule } from '../../usecases-proxy/usecases-proxy.module';
import { LoginUseCases } from 'src/usecases/account/login.usecases';
import { LogoutUseCases } from 'src/usecases/account/logout.usecases';
import { IsAuthenticatedUseCases } from 'src/usecases/account/isAuthenticated.usecases';
import { LoginGuard } from 'src/infrastructure/common/guards/login.guard';
import { JwtAuthGuard } from 'src/infrastructure/common/guards/jwtAuth.guard';
import JwtRefreshGuard from 'src/infrastructure/common/guards/jwtRefresh.guard';
import { ApiResponseType } from '../../common/swagger/response.decorator';
import { addAccountUseCases } from 'src/usecases/account/addAccount.usecases';
import { SignUpDto } from './signup-dto.class';
import { IsSignUpPresenter } from './signup.presenter';
import { DeleteUseCases } from 'src/usecases/account/deleteMyAccount.usecases';
import { UpdateDto } from './update-dto.class';
import { UpdateAccountUseCases } from 'src/usecases/account/update_account.usecases';
import { GetAccountUseCases } from 'src/usecases/account/getMyAccount.usecases';
import { addPatientUseCases } from 'src/usecases/patient/addPatient.usecases';
import { UserPresenter } from './user.presenter';

@Controller('auth')
@ApiTags('auth')
@ApiResponse({
  status: 401,
  description: 'No authorization token was found',
})
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(IsAuthPresenter)
export class AuthController {
  constructor(
    @Inject(UsecasesProxyModule.LOGIN_USECASES_PROXY)
    private readonly loginUsecaseProxy: UseCaseProxy<LoginUseCases>,
    @Inject(UsecasesProxyModule.LOGOUT_USECASES_PROXY)
    private readonly logoutUsecaseProxy: UseCaseProxy<LogoutUseCases>,
    @Inject(UsecasesProxyModule.IS_AUTHENTICATED_USECASES_PROXY)
    private readonly isAuthUsecaseProxy: UseCaseProxy<IsAuthenticatedUseCases>,
    @Inject(UsecasesProxyModule.POST_ACCOUNT_USECASES_PROXY)
    private readonly addAccountUseCasesProxy: UseCaseProxy<addAccountUseCases>,
    @Inject(UsecasesProxyModule.DELETE_ACCOUNT_USECASES_PROXY)
    private readonly deleteMyAccountUsecaseProxy: UseCaseProxy<DeleteUseCases>,
    @Inject(UsecasesProxyModule.UPDATE_ACCOUNT_USECASES_PROXY)
    private readonly updateMyAccountUsecaseProxy: UseCaseProxy<UpdateAccountUseCases>,
    @Inject(UsecasesProxyModule.GET_ACCOUNT_USECASES_PROXY)
    private readonly getAccountUsecaseProxy: UseCaseProxy<GetAccountUseCases>,
    @Inject(UsecasesProxyModule.POST_PATIENT_USECASES_PROXY)
    private readonly addPatientUseCasesProxy: UseCaseProxy<addPatientUseCases>,
  ) {}

  @Post('login')
  @UseGuards(LoginGuard)
  @ApiBearerAuth()
  @ApiBody({ type: AuthLoginDto })
  @ApiOperation({ description: 'login' })
  async login(@Body() auth: AuthLoginDto, @Request() request: any) {
    const accessTokenCookie = await this.loginUsecaseProxy
      .getInstance()
      .getCookieWithJwtToken(auth.username);
    const refreshTokenCookie = await this.loginUsecaseProxy
      .getInstance()
      .getCookieWithJwtRefreshToken(auth.username);
    request.res.setHeader('Set-Cookie', [
      accessTokenCookie,
      refreshTokenCookie,
    ]);
    return 'Login successful';
  }

  @Post('signup')
  @ApiBody({ type: SignUpDto })
  @ApiOperation({ description: 'signup' })
  async addaccount(@Body() signUpDto: SignUpDto) {
    await this.addAccountUseCasesProxy
      .getInstance()
      .checkUserUniqueness(signUpDto.username, signUpDto.email);
    const accountCreated = await this.addAccountUseCasesProxy
      .getInstance()
      .execute(signUpDto);
    await this.addPatientUseCasesProxy.getInstance().execute(accountCreated);
    return new IsSignUpPresenter(accountCreated);
  }

  // @Post('signup_doctor')
  // @ApiBody({ type: SignUpDto })
  // @ApiBearerAuth()
  // @ApiOperation({ description: 'signupDoctor' })
  // @UseGuards(JwtAuthGuard)
  // async addaccountdoctor(
  //   @Body() signUpDto: SignUpDto,
  //   @Request() request: any,
  // ) {
  //   await this.addAccountUseCasesProxy
  //     .getInstance()
  //     .checkUserUniqueness(signUpDto.username, signUpDto.email);
  //   const accountCreated = await this.addAccountUseCasesProxy
  //     .getInstance()
  //     .executeDoctor(signUpDto, request.user.accountType);
  //   return new IsSignUpPresenter(accountCreated);
  // }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'logout' })
  async logout(@Request() request: any) {
    const cookie = await this.logoutUsecaseProxy.getInstance().execute();
    request.res.setHeader('Set-Cookie', cookie);
    return 'Logout successful';
  }

  @Get('is_authenticated')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'is_authenticated' })
  @ApiResponseType(IsAuthPresenter, false)
  async isAuthenticated(@Req() request: any) {
    const user = await this.isAuthUsecaseProxy
      .getInstance()
      .execute(request.user.username);
    const response = new IsAuthPresenter();
    response.username = user.username;
    return response;
  }

  @Get('refresh')
  @UseGuards(JwtRefreshGuard)
  @ApiBearerAuth()
  async refresh(@Req() request: any) {
    const accessTokenCookie = await this.loginUsecaseProxy
      .getInstance()
      .getCookieWithJwtToken(request.user.username);
    request.res.setHeader('Set-Cookie', accessTokenCookie);
    return 'Refresh successful';
  }

  @Delete('delete_my_account')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ description: 'delete' })
  async deleteMyAccount(@Req() request: any) {
    const usernameId = request.user.id;
    await this.deleteMyAccountUsecaseProxy
      .getInstance()
      .deleteMyAccount(usernameId);
    return 'Delete successful';
  }

  @Patch('update_my_account')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ description: 'update' })
  async updateMyAccount(@Req() request: any, @Body() updateDto: UpdateDto) {
    const user_id = request.user.id;
    await this.updateMyAccountUsecaseProxy
      .getInstance()
      .updateAccountInfo(user_id, updateDto);
    return 'Update successful';
  }

  @Get('get_my_account')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ description: 'get' })
  async getMyAccount(@Req() request: any) {
    const user_id = request.user.id;
    const user = await this.getAccountUsecaseProxy
      .getInstance()
      .getAccountInfo(user_id);
    return user;
  }

  @Get('get_all_accounts')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ description: 'get' })
  @ApiResponseType(UserPresenter, true)
  async getAllAccounts(@Req() request: any) {
    const users = await this.getAccountUsecaseProxy
      .getInstance()
      .getAllAccounts(request.user.accountType);
    console.log(users);
    return users.map((user: any) => new UserPresenter(user));
  }

  @Patch('changeRole/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ description: 'changeRole' })
  async changeRole(@Req() request: any, @Param('id') id: string) {
    await this.updateMyAccountUsecaseProxy
      .getInstance()
      .changeRole(id, request.user);
    return 'Role changed successfully';
  }
}
