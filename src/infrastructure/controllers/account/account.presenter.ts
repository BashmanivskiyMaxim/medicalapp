import { ApiProperty } from '@nestjs/swagger';
import { AccountModel } from 'src/domain/model/accountModel';

export class AccountPresenter {
  //@ApiProperty()
  //id: number;
  @ApiProperty()
  username: string;
  @ApiProperty()
  password: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  firstName: string;
  @ApiProperty()
  lastName: string;
  @ApiProperty()
  accountType: string;

  constructor(account: AccountModel) {
    //this.id = account.id;
    this.username = account.username;
    //this.password = account.password;
    this.email = account.email;
    this.firstName = account.firstName;
    this.lastName = account.lastName;
    this.accountType = account.accountType;
  }
}
