import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { BaseAbstractRepository } from './base/base.abstract.repository';

import { AddressEntity } from '../entities/address.entity';
import { AddressRepository } from '../../domain/repositories/address.repository.interface';
import { AddressModel } from 'src/domain/model/addressModel';

@Injectable()
export class DatabaseAddressRepository
  extends BaseAbstractRepository<AddressEntity>
  implements AddressRepository
{
  constructor(
    @InjectRepository(AddressEntity)
    private readonly addressEntity: Repository<AddressEntity>,
  ) {
    super(addressEntity);
  }
  getAddresses(accountId: any): Promise<any> {
    return this.addressEntity.find({
      where: {
        account: accountId,
      },
    });
  }
  async createAddress(address: AddressModel): Promise<any> {
    const addressEntity = this.addressEntity.create({
      account: { id: address.accountId },
      address: address.address,
    });
    return await this.addressEntity.save(addressEntity);
  }
  async updateAddress(address: any, account_id: number): Promise<any> {
    const addressGet = await this.findByAccountId(account_id);
    return await this.addressEntity.save({
      id: addressGet.id,
      address: address.address,
    });
  }
  deleteAddress(id: number): Promise<any> {
    return this.addressEntity.delete(id);
  }
  findByProperty(address: AddressModel): Promise<any> {
    return this.addressEntity.findOne({
      where: {
        address: address.address,
      },
    });
  }
  async findByAccountId(account_id: number): Promise<any> {
    return await this.addressEntity.findOne({
      where: { account: { id: account_id } },
    });
  }

  async findAddress(): Promise<AddressEntity | undefined> {
    return await this.addressEntity.findOne({});
  }

  async getAllAddresses(): Promise<any> {
    return await this.addressEntity.find();
  }
}
