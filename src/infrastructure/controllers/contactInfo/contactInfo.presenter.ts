import { ApiProperty } from '@nestjs/swagger';
import { ContactInfoModel } from 'src/domain/model/contactInfoModel';

export class ContactInfoPresenter {
  @ApiProperty()
  contactNumber: string;

  constructor(contactInfo: ContactInfoModel) {
    this.contactNumber = contactInfo.contactNumber;
  }
}
