import { AddressModel } from '../model/addressModel';

export interface AddressRepository {
  createAddress(address: any): Promise<any>;
  updateAddress(address: any): Promise<any>;
  deleteAddress(address: any): Promise<any>;
  getAddress(address: AddressModel): Promise<any>;
  getAddresses(id: number[]): Promise<any>;
}
