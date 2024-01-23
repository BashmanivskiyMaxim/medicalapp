export class AccountModel {
  id?: number;
  createDate?: Date;
  updatedDate?: Date;
  lastLogin?: Date;
  hashRefreshToken?: string;
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  accountType?: string;
}

export class UserM extends AccountModel {
  password: string;
}
