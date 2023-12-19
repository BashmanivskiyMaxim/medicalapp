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
  deleteMedicalHistory(medicalHistory: MedicalHistoryModel): Promise<any> {
    return this.medicalHistoryEntityRepository.delete(medicalHistory.id);
  }
  createMedicalHistory(medicalHistory: MedicalHistoryModel): Promise<any> {
    const medicalHistoryEntity = this.medicalHistoryEntityRepository.create({
      id: medicalHistory.id,
      patient: { id: medicalHistory.patientId },
      medicalProcedure: { id: medicalHistory.medicalProcedureId },
      date: medicalHistory.date,
    });
    return this.medicalHistoryEntityRepository.save(medicalHistoryEntity);
  }
  updateMedicalHistory(medicalHistory: MedicalHistoryModel): Promise<any> {
    return this.medicalHistoryEntityRepository.update(medicalHistory.id, {
      id: medicalHistory.id,
      patient: { id: medicalHistory.patientId },
      medicalProcedure: { id: medicalHistory.medicalProcedureId },
      date: medicalHistory.date,
    });
  }
}
