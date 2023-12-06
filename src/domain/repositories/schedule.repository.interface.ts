import { BaseInterfaceRepository } from '@app/shared';
import { ScheduleEntity } from '../entities/schedule.entity';

export interface ScheduleRepositoryInterface
  extends BaseInterfaceRepository<ScheduleEntity> {
  findschedule(
    userId: number,
    friendId: number,
  ): Promise<ScheduleEntity | undefined>;
}
