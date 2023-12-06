import { BaseInterfaceRepository } from '@app/shared';

import { DoctorEntity } from '../entities/doctor.entity';

export interface DoctorRepositoryInterface
  extends BaseInterfaceRepository<DoctorEntity> {
  findoctor(
    userId: number,
    friendId: number,
  ): Promise<DoctorEntity | undefined>;
}
