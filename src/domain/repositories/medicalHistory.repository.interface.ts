import { BaseInterfaceRepository } from '@app/shared';
import { MedicalHistoryEntity } from '../entities/medicalHistory.entity';

export interface MedicalHistoryRepositoryInterface
  extends BaseInterfaceRepository<MedicalHistoryEntity> {
  findmed(
    userId: number,
    friendId: number,
  ): Promise<MedicalHistoryEntity | undefined>;
}
