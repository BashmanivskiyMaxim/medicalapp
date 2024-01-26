import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { BaseAbstractRepository } from './base/base.abstract.repository';
import { DoctorEntity } from '../entities/doctor.entity';
import { DoctorRepository } from '../../domain/repositories/doctor.repository.interface';
import { DoctorModel } from 'src/domain/model/doctorModel';

@Injectable()
export class DatabaseDoctorRepository
  extends BaseAbstractRepository<DoctorEntity>
  implements DoctorRepository
{
  constructor(
    @InjectRepository(DoctorEntity)
    private readonly doctorEntityRepository: Repository<DoctorEntity>,
  ) {
    super(doctorEntityRepository);
  }
  createDoctor(doctor: DoctorModel): Promise<any> {
    const doctorEntity = this.doctorEntityRepository.create({
      account: { id: doctor.accountId },
      specialty: doctor.specialty,
      qualification: doctor.qualification,
    });
    return this.doctorEntityRepository.save(doctorEntity);
  }
  async updateDoctor(id: number, doctor: DoctorModel): Promise<any> {
    return this.doctorEntityRepository.save({
      id: id,
      ...doctor,
    });
  }
  deleteDoctor(doctorAccountId: number): Promise<any> {
    return this.doctorEntityRepository.delete(doctorAccountId);
  }
  async getDoctor(doctor: DoctorModel): Promise<any> {
    return await this.doctorEntityRepository.findOne({
      where: { id: doctor.id },
    });
  }
  getDoctors(): Promise<any> {
    return this.doctorEntityRepository.find();
  }
  findByAccountId(accountId: number): Promise<any> {
    return this.doctorEntityRepository.findOne({
      where: { account: { id: accountId } },
    });
  }
}
