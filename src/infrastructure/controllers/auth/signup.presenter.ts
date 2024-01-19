import { ApiProperty } from '@nestjs/swagger';

export class IsSignUpPresenter {
  @ApiProperty()
  username: string;

  constructor(account) {
    this.username = account.username;
  }
}
