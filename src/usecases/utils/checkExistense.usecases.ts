import { ConflictException, NotFoundException } from '@nestjs/common';

export class CheckExistenceUseCase {
  constructor(private repository: any) {}

  async execute(id: string, throwErrorIfExists: boolean = false) {
    const existingEntity = await this.repository.findById(+id);
    if (existingEntity && throwErrorIfExists) {
      throw new ConflictException('Entity already exists');
    }

    if (!existingEntity && !throwErrorIfExists) {
      throw new NotFoundException('Entity does not exist');
    }
  }
}
