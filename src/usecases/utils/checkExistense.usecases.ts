import { ConflictException, NotFoundException } from '@nestjs/common';
import { IEntityValidator } from './checkExistense.interface';

export class EntityValidator implements IEntityValidator {
  constructor(private repository: any) {
    this.repository = repository;
  }

  private throwErrorIfExists(
    condition: boolean,
    message: string,
    errorType: any,
  ) {
    if (condition) {
      throw new errorType(message);
    }
  }

  async uniqueness(property: string, value: any): Promise<void> {
    const existingEntity = await this.repository.findByProperty(value);
    if (existingEntity) {
      throw new ConflictException(`${property} already exists`);
    }
  }

  async existence(id: string, throwErrorIfExists: boolean = false) {
    const existingEntity = await this.repository.findByAccountId(+id);
    this.throwErrorIfExists(
      existingEntity && throwErrorIfExists,
      'Entity already exists',
      ConflictException,
    );
    this.throwErrorIfExists(
      !existingEntity && !throwErrorIfExists,
      'Entity does not exist',
      NotFoundException,
    );
  }

  async existenceByUsername(
    username: string,
    throwErrorIfExists: boolean = false,
  ) {
    const existingEntity = await this.repository.findByUsername(username);
    this.throwErrorIfExists(
      existingEntity && throwErrorIfExists,
      'Entity already exists',
      ConflictException,
    );
    this.throwErrorIfExists(
      !existingEntity && !throwErrorIfExists,
      'Entity does not exist',
      NotFoundException,
    );
  }
}
