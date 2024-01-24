import { ContactInfoModel } from '../model/contactInfoModel';

export interface ContactInfoRepository {
  createContactInfo(contactInfo: ContactInfoModel): Promise<any>;
  updateContactInfo(
    contactInfo: ContactInfoModel,
    account_id: number,
  ): Promise<any>;
  deleteContactInfo(id: number): Promise<any>;
  getContactInfo(contactInfo: any): Promise<any>;
  findContactInfoByContactNumber(contactNumber: string): Promise<any>;
  findContactInfoByAccountId(accountId: number): Promise<any>;
  getAllContactInfo(): Promise<any>;
}
