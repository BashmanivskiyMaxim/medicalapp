import { AccountModel } from '../model/accountModel';

export interface AccountRepository {
  createAccount(data: AccountModel): Promise<any>;
  findAccountByEmail(email: string): Promise<any>;
  findAccountById(id: number): Promise<any>;
  updateAccountById(id: string, data: any): Promise<any>;
  deleteAccountById(id: string): Promise<any>;
}
