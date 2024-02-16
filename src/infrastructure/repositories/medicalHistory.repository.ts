import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { BaseAbstractRepository } from './base/base.abstract.repository';
import { MedicalHistoryEntity } from '../entities/medicalHistory.entity';
import { MedicalHistoryRepository } from '../../domain/repositories/medicalHistory.repository.interface';
import { MedicalHistoryModel } from 'src/domain/model/medicalHistoryModel';

@Injectable()
export class DatabaseMedicalHistoryRepository
  extends BaseAbstractRepository<MedicalHistoryEntity>
  implements MedicalHistoryRepository
{
  constructor(
    @InjectRepository(MedicalHistoryEntity)
    private readonly medicalHistoryEntityRepository: Repository<MedicalHistoryEntity>,
  ) {
    super(medicalHistoryEntityRepository);
  }
  getMedicalHistory(): Promise<any> {
    return this.medicalHistoryEntityRepository.find();
  }
  getMedicalHistoryById(medicalHistoryId: number): Promise<any> {
    return this.medicalHistoryEntityRepository.findOne({
      where: { id: medicalHistoryId },
    });
  }
  deleteMedicalHistory(medicalHistoryId: number): Promise<any> {
    return this.medicalHistoryEntityRepository.delete(medicalHistoryId);
  }

  createMedicalHistory(medicalHistory: MedicalHistoryModel): Promise<any> {
    const medicalHistoryEntity = this.medicalHistoryEntityRepository.create({
      id: medicalHistory.id,
      patient: { id: medicalHistory.patientId },
      created_date: medicalHistory.createdDate,
      updated_date: medicalHistory.updatedDate,
      medical_info: medicalHistory.medicalInfo,
    });
    return this.medicalHistoryEntityRepository.save(medicalHistoryEntity);
  }

  updateMedicalHistory(medicalHistory: MedicalHistoryModel): Promise<any> {
    return this.medicalHistoryEntityRepository.update(medicalHistory.id, {
      id: medicalHistory.id,
      patient: { id: medicalHistory.patientId },
      created_date: medicalHistory.createdDate,
      updated_date: medicalHistory.updatedDate,
      medical_info: medicalHistory.medicalInfo,
    });
  }
}
