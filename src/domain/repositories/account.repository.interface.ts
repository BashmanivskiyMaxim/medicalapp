import { AccountModel, UserM } from '../model/accountModel';

export interface AccountRepository {
  createAccount(data: AccountModel): Promise<any>;
  findAccountByEmail(email: string): Promise<any>;
  findAccountById(id: number): Promise<any>;
  updateAccountById(id: string, data: any): Promise<any>;
  deleteAccountById(id: string): Promise<any>;
  getUserByUsername(username: string): Promise<UserM>;
  updateLastLogin(username: string): Promise<void>;
  updateRefreshToken(username: string, refreshToken: string): Promise<void>;
  findAccountByUsername(username: string): Promise<any>;
}
