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
      id: doctor.id,
      account: { id: doctor.accountId },
      specialty: doctor.specialty,
      qualification: doctor.qualification,
    });
    return this.doctorEntityRepository.save(doctorEntity);
  }
  async updateDoctor(doctor: DoctorModel, account_id: number): Promise<any> {
    const doctorGet = await this.findDoctorByAccountId(account_id);
    return this.doctorEntityRepository.save({
      id: doctorGet.id,
      specialty: doctor.specialty,
      qualification: doctor.qualification,
    });
  }
  deleteDoctor(doctor: DoctorModel): Promise<any> {
    return this.doctorEntityRepository.delete(doctor.id);
  }
  getDoctor(doctor: DoctorModel): Promise<any> {
    return this.doctorEntityRepository.findOne({
      where: { id: doctor.id },
    });
  }
  getDoctors(doctor: DoctorModel[]): Promise<any> {
    return this.doctorEntityRepository.find({
      where: doctor.map((doctor) => ({ id: doctor.id })),
    });
  }
  findDoctorByAccountId(accountId: number): Promise<any> {
    return this.doctorEntityRepository.findOne({
      where: { account: { id: accountId } },
    });
  }
}
