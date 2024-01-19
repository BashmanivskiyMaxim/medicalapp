import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Req,
  Request,
  UseGuards,
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
import { UserM } from 'src/domain/model/accountModel';

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
    // const accessTokenCookie = await this.loginUsecaseProxy
    //   .getInstance()
    //   .getCookieWithJwtToken(signUpDto.username);
    // const refreshTokenCookie = await this.loginUsecaseProxy
    //   .getInstance()
    //   .getCookieWithJwtRefreshToken(signUpDto.username);
    const hashedPassword = await this.addAccountUseCasesProxy
      .getInstance()
      .getHashedPassword(signUpDto.password);
    const signUpDtoWithHashedPassword: UserM = {
      ...signUpDto,
      createDate: new Date(),
      updatedDate: new Date(),
      lastLogin: new Date(),
      accountType: 'user',
      password: hashedPassword,
    };
    const accountCreated = await this.addAccountUseCasesProxy
      .getInstance()
      .execute(signUpDtoWithHashedPassword);
    // request.res.setHeader('Set-Cookie', [
    //   accessTokenCookie,
    //   refreshTokenCookie,
    // ]);
    return new IsSignUpPresenter(accountCreated);
  }

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
}
