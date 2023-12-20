import { ILogger } from 'src/domain/logger/logger.interface';
import { ContactInfoRepository } from 'src/domain/repositories/contactInfo.repository.interface';
import { ContactInfoModel } from 'src/domain/model/contactInfoModel';

export class addContactInfoUseCases {
  constructor(
    private readonly logger: ILogger,
    private readonly contactInfoRepository: ContactInfoRepository,
  ) {}
  async execute(data: ContactInfoModel): Promise<ContactInfoModel> {
    const contactInfo = new ContactInfoModel();
    contactInfo.id = data.id;
    contactInfo.accountId = data.accountId;
    contactInfo.contactNumber = data.contactNumber;
    const result =
      await this.contactInfoRepository.createContactInfo(contactInfo);
    this.logger.log(
      'addContactInfoUseCases execute',
      'New contactInfo have been inserted',
    );
    return result;
  }
}
