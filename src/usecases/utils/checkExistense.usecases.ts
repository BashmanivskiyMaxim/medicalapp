import { ConflictException, NotFoundException } from '@nestjs/common';
import { IEntityValidator } from './checkExistense.interface';

export class EntityValidator implements IEntityValidator {
  constructor(private repository: any) {
    this.repository = repository;
  }

  async uniqueness(property: string, value: any): Promise<void> {
    const existingEntity = await this.repository.findByProperty(value);

    if (existingEntity) {
      throw new ConflictException(`${property} already exists`);
    }
  }

  async existence(id: string, throwErrorIfExists: boolean = false) {
    const existingEntity = await this.repository.findByAccountId(+id);
    if (existingEntity && throwErrorIfExists) {
      throw new ConflictException('Entity already exists');
    }

    if (!existingEntity && !throwErrorIfExists) {
      throw new NotFoundException('Entity does not exist');
    }
  }
}
