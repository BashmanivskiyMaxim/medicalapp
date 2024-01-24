import { ILogger } from 'src/domain/logger/logger.interface';
import { ContactInfoRepository } from 'src/domain/repositories/contactInfo.repository.interface';
import { ContactInfoModel } from 'src/domain/model/contactInfoModel';
import { ConflictException, NotFoundException } from '@nestjs/common';

export class addContactInfoUseCases {
  constructor(
    private readonly logger: ILogger,
    private readonly contactInfoRepository: ContactInfoRepository,
  ) {}
  async execute(
    data: ContactInfoModel,
    account_Id: string,
  ): Promise<ContactInfoModel> {
    const contactInfo = new ContactInfoModel();
    contactInfo.accountId = +account_Id;
    contactInfo.contactNumber = data.contactNumber;
    const result =
      await this.contactInfoRepository.createContactInfo(contactInfo);
    this.logger.log(
      'addContactInfoUseCases execute',
      'New contactInfo have been inserted',
    );
    return result;
  }
  async checkUniqueness(contactNumber: string) {
    const existingContactNumber =
      await this.contactInfoRepository.findContactInfoByContactNumber(
        contactNumber,
      );

    if (existingContactNumber) {
      throw new ConflictException('Contact number already exists');
    }
  }
  async checkExistence(
    account_id: string,
    throwErrorIfExists: boolean = false,
  ) {
    const existingContactNumberAccount =
      await this.contactInfoRepository.findContactInfoByAccountId(+account_id);

    if (existingContactNumberAccount && throwErrorIfExists) {
      throw new ConflictException(
        'Contact info for this account already exists',
      );
    }

    if (!existingContactNumberAccount && !throwErrorIfExists) {
      throw new NotFoundException(
        'Contact info for this account does not exist',
      );
    }
  }
  async updateContactInfo(
    data: ContactInfoModel,
    account_id: string,
  ): Promise<ContactInfoModel> {
    await this.checkExistence(account_id, false);
    await this.checkUniqueness(data.contactNumber);
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
    await this.checkExistence(account_id, false);
    const existingContactNumberAccount =
      await this.contactInfoRepository.findContactInfoByAccountId(+account_id);
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
    } else {
      throw new ConflictException('Permission denied');
    }
  }
}
