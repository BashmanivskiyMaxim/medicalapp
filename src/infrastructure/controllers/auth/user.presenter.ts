import { ApiProperty } from '@nestjs/swagger';
import { AccountModel } from 'src/domain/model/accountModel';

export class UserPresenter {
  @ApiProperty()
  id: number;
  @ApiProperty()
  username: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  accountType: string;
  @ApiProperty()
  createDate: Date;
  @ApiProperty()
  updatedDate: Date;
  @ApiProperty()
  lastLogin: Date;

  constructor(account: AccountModel) {
    this.id = account.id;
    this.username = account.username;
    this.email = account.email;
    this.accountType = account.accountType;
    this.createDate = account.createDate;
    this.updatedDate = account.updatedDate;
    this.lastLogin = account.lastLogin;
  }
}
