import { AccountRepository } from 'src/domain/repositories/account.repository.interface';
import { ILogger } from '../../domain/logger/logger.interface';
import { NotFoundException } from '@nestjs/common';

export class DeleteUseCases {
  constructor(
    private readonly logger: ILogger,
    private readonly userRepository: AccountRepository,
  ) {}

  async deleteMyAccount(id: string) {
    try {
      await this.userRepository.deleteAccountById(id);
      this.logger.log(
        'DeleteUseCases execute',
        `The user with id = ${id} have been deleted.`,
      );
      return [
        'Authentication=; HttpOnly; Path=/; Max-Age=0',
        'Refresh=; HttpOnly; Path=/; Max-Age=0',
      ];
    } catch (error) {
      throw new NotFoundException(`Failed to delete user with id = ${id}`);
    }
  }
}
