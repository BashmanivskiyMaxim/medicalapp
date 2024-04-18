import { IBcryptService } from 'src/domain/adapters/bcrypt.interface';
import {
  IJwtService,
  IJwtServicePayload,
} from 'src/domain/adapters/jwt.interface';
import { JWTConfig } from 'src/domain/config/jwt.interface';
import { ILogger } from 'src/domain/logger/logger.interface';
import { UserM } from '../../domain/model/accountModel';
import { AccountRepository } from '../../domain/repositories/account.repository.interface';
import { ForbiddenException, ConflictException } from '@nestjs/common';

export class addAccountUseCases {
  constructor(
    private readonly logger: ILogger,
    private readonly jwtTokenService: IJwtService,
    private readonly jwtConfig: JWTConfig,
    private readonly userRepository: AccountRepository,
    private readonly bcryptService: IBcryptService,
  ) {}
  async execute(data: UserM, isAdmin?: string): Promise<UserM> {
    const hashedPassword = await this.bcryptService.hash(data.password);

    const account = new UserM();
    account.email = data.email;
    account.password = hashedPassword;
    account.username = data.username;
    account.firstName = data.firstName;
    account.lastName = data.lastName;
    account.createDate = new Date();
    account.updatedDate = new Date();
    account.lastLogin = new Date();

    if (isAdmin === 'admin') account.accountType = 'doctor';
    else account.accountType = 'user';

    const result = await this.userRepository.createAccount(account);
    this.logger.log(
      'addAccountUseCases execute',
      'New account have been inserted',
    );
    return result;
  }

  async executeDoctor(data: UserM, isAdmin?: string): Promise<UserM> {
    if (isAdmin === 'admin') {
      return this.execute(data, 'admin');
    } else {
      throw new ForbiddenException(
        'Permission denied. Only administrators can execute this operation.',
      );
    }
  }

  async checkUserUniqueness(username: string, email: string) {
    const existingUsername =
      await this.userRepository.findAccountByUsername(username);
    const existingEmail = await this.userRepository.findAccountByEmail(email);

    const errors = [];

    if (existingUsername) {
      errors.push({
        field: 'username',
        message: `Username '${username}' already exists`,
      });
    }

    if (existingEmail) {
      errors.push({
        field: 'email',
        message: `Email '${email}' already exists`,
      });
    }

    if (errors.length > 0) {
      throw new ConflictException(errors);
    }
  }

  async getCookieWithJwtToken(username: string) {
    this.logger.log(
      'LoginUseCases execute',
      `The user ${username} have been logged.`,
    );
    const payload: IJwtServicePayload = { username: username };
    const secret = this.jwtConfig.getJwtSecret();
    const expiresIn = this.jwtConfig.getJwtExpirationTime() + 's';
    const token = this.jwtTokenService.createToken(payload, secret, expiresIn);
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.jwtConfig.getJwtExpirationTime()}`;
  }

  async getHashedPassword(password: string) {
    const hashedPassword = await this.bcryptService.hash(password);
    return hashedPassword;
  }

  async getCookieWithJwtRefreshToken(username: string) {
    this.logger.log(
      'LoginUseCases execute',
      `The user ${username} have been logged.`,
    );
    const payload: IJwtServicePayload = { username: username };
    const secret = this.jwtConfig.getJwtRefreshSecret();
    const expiresIn = this.jwtConfig.getJwtRefreshExpirationTime() + 's';
    const token = this.jwtTokenService.createToken(payload, secret, expiresIn);
    await this.setCurrentRefreshToken(token, username);
    const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${this.jwtConfig.getJwtRefreshExpirationTime()}`;
    return cookie;
  }

  getRefreshToken(username: string) {
    const payload: IJwtServicePayload = { username: username };
    const secret = this.jwtConfig.getJwtRefreshSecret();
    const expiresIn = this.jwtConfig.getJwtRefreshExpirationTime() + 's';
    const token = this.jwtTokenService.createToken(payload, secret, expiresIn);
    return token;
  }

  async validateUserForLocalStragtegy(username: string, pass: string) {
    const user = await this.userRepository.getUserByUsername(username);
    if (!user) {
      return null;
    }
    const match = await this.bcryptService.compare(pass, user.password);
    if (user && match) {
      await this.updateLoginTime(user.username);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async validateUserForJWTStragtegy(username: string) {
    const user = await this.userRepository.getUserByUsername(username);
    if (!user) {
      return null;
    }
    return user;
  }

  async updateLoginTime(username: string) {
    await this.userRepository.updateLastLogin(username);
  }

  async setCurrentRefreshToken(refreshToken: string, username: string) {
    const currentHashedRefreshToken =
      await this.bcryptService.hash(refreshToken);
    await this.userRepository.updateRefreshToken(
      username,
      currentHashedRefreshToken,
    );
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, username: string) {
    const user = await this.userRepository.getUserByUsername(username);
    if (!user) {
      return null;
    }

    const isRefreshTokenMatching = await this.bcryptService.compare(
      refreshToken,
      user.hashRefreshToken,
    );
    if (isRefreshTokenMatching) {
      return user;
    }

    return null;
  }
}
