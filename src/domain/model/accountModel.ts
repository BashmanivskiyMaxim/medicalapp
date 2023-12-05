export class AccountModel {
  id: number;
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  accountType: string;

  constructor(
    id: number,
    username: string,
    password: string,
    email: string,
    firstName: string,
    lastName: string,
    accountType: string,
  ) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.accountType = accountType;
  }
}
