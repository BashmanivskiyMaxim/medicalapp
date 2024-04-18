import { ILogger } from '../../domain/logger/logger.interface';
import { ContactInfoRepository } from '../../domain/repositories/contactInfo.repository.interface';
import { ContactInfoModel } from '../../domain/model/contactInfoModel';
import { ConflictException } from '@nestjs/common';
import { EntityValidator } from '../utils/checkExistense.usecases';

export class addContactInfoUseCases {
  constructor(
    private readonly logger: ILogger,
    private readonly contactInfoRepository: ContactInfoRepository,
    private readonly checkExistenceUseCase: EntityValidator,
  ) {}
  async execute(
    data: ContactInfoModel,
    account_id: string,
  ): Promise<ContactInfoModel> {
    await this.checkExistenceUseCase.existence(account_id, true);
    await this.checkExistenceUseCase.uniqueness(
      'contactInfo',
      data.contactNumber,
    );
    const contactInfo = new ContactInfoModel();
    contactInfo.accountId = +account_id;
    contactInfo.contactNumber = data.contactNumber;
    const result =
      await this.contactInfoRepository.createContactInfo(contactInfo);
    this.logger.log(
      'addContactInfoUseCases execute',
      'New contactInfo have been inserted',
    );
    return result;
  }
  async updateContactInfo(
    data: ContactInfoModel,
    account_id: string,
  ): Promise<ContactInfoModel> {
    await this.checkExistenceUseCase.existence(account_id, false);
    await this.checkExistenceUseCase.uniqueness(
      'contactInfo',
      data.contactNumber,
    );
    const contactInfo = new ContactInfoModel();
    contactInfo.contactNumber = data.contactNumber;
    const result = await this.contactInfoRepository.updateContactInfo(
      contactInfo,
      +account_id,
    );
    this.logger.log(
      'updateContactInfoUseCases execute',
      'ContactInfo have been updated',
    );
    return result;
  }
  async deleteContactInfo(account_id: string): Promise<ContactInfoModel> {
    await this.checkExistenceUseCase.existence(account_id, false);
    const existingContactNumberAccount =
      await this.contactInfoRepository.findByAccountId(+account_id);
    const result = await this.contactInfoRepository.deleteContactInfo(
      +existingContactNumberAccount.id,
    );
    this.logger.log(
      'deleteContactInfoUseCases execute',
      'ContactInfo have been deleted',
    );
    return result;
  }

  async getAllContactInfo(account_type: string): Promise<ContactInfoModel> {
    if (account_type === 'admin') {
      const ContactNumberAccounts =
        await this.contactInfoRepository.getAllContactInfo();
      this.logger.log(
        `getContactInfoUseCases execute, ${ContactNumberAccounts.length} have been get`,
        'ContactInfo have been get',
      );
      return ContactNumberAccounts;
    } else throw new ConflictException('Permission denied');
  }
}
