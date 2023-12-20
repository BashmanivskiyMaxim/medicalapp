import { ApiProperty } from '@nestjs/swagger';
import { ContactInfoModel } from 'src/domain/model/contactInfoModel';

export class ContactInfoPresenter {
  @ApiProperty()
  id: number;
  @ApiProperty()
  accountId: number;
  @ApiProperty()
  contactNumber: string;

  constructor(contactInfo: ContactInfoModel) {
    this.id = contactInfo.id;
    this.accountId = contactInfo.accountId;
    this.contactNumber = contactInfo.contactNumber;
  }
}
