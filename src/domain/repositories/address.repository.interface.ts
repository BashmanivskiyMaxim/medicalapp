import { AddressModel } from '../model/addressModel';

export interface AddressRepository {
  createAddress(address: any): Promise<any>;
  updateAddress(address: any, account_id: number): Promise<any>;
  deleteAddress(id: number): Promise<any>;
  findByProperty(address: AddressModel): Promise<any>;
  getAddresses(id: number[]): Promise<any>;
  findByAccountId(accountId: number): Promise<any>;
  getAllAddresses(): Promise<any>;
}
