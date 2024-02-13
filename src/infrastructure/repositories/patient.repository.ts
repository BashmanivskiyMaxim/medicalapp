import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { BaseAbstractRepository } from './base/base.abstract.repository';
import { PatientEntity } from '../entities/patient.entity';
import { PatientRepository } from '../../domain/repositories/patient.repository.interface';
import { PatientModel } from 'src/domain/model/patientModel';

@Injectable()
export class DatabasePatientRepository
  extends BaseAbstractRepository<PatientEntity>
  implements PatientRepository
{
  constructor(
    @InjectRepository(PatientEntity)
    private readonly patientEntityRepository: Repository<PatientEntity>,
  ) {
    super(patientEntityRepository);
  }
  createPatient(patient: PatientModel): Promise<any> {
    const patientEntity = this.patientEntityRepository.create({
      account: { id: patient.accountId },
      doctor: { id: patient.doctorId },
    });
    return this.patientEntityRepository.save(patientEntity);
  }
  updatePatient(patient: PatientModel): Promise<any> {
    return this.patientEntityRepository.update(patient.id, {
      account: { id: patient.accountId },
      doctor: { id: patient.doctorId },
    });
  }
  deletePatient(patientId: number): Promise<any> {
    return this.patientEntityRepository.delete(patientId);
  }
  getPatient(patientId: number, doctorId: number): Promise<any> {
    return this.patientEntityRepository.findOne({
      where: { id: patientId, doctor: { id: doctorId } },
      // add complete patient info to db
    });
  }
  getPatients(doctorId: number): Promise<any> {
    return this.patientEntityRepository.find({
      where: { doctor: { id: doctorId } },
    });
  }
}
