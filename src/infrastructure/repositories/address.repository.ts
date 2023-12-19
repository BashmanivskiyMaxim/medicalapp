//rewrite this repository like the account repository

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
        accountId: accountId,
      },
    });
  }
  createAddress(address: any): Promise<any> {
    const addressEntity = this.addressEntity.create(address);
    return this.addressEntity.save(addressEntity);
  }
  updateAddress(address: any): Promise<any> {
    return this.addressEntity.update(address.id, address);
  }
  deleteAddress(address: any): Promise<any> {
    return this.addressEntity.delete(address.id);
  }
  getAddress(address: AddressModel): Promise<any> {
    return this.addressEntity.findOne({
      where: {
        address: address.address,
      },
    });
  }

  public async findAddress(): Promise<AddressEntity | undefined> {
    return await this.addressEntity.findOne({});
  }
}
