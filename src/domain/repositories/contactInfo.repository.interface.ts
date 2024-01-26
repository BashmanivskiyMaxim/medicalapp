import { ContactInfoModel } from '../model/contactInfoModel';

export interface ContactInfoRepository {
  createContactInfo(contactInfo: ContactInfoModel): Promise<any>;
  updateContactInfo(
    contactInfo: ContactInfoModel,
    account_id: number,
  ): Promise<any>;
  deleteContactInfo(id: number): Promise<any>;
  getContactInfo(contactInfo: any): Promise<any>;
  findByProperty(contactNumber: string): Promise<any>;
  findByAccountId(accountId: number): Promise<any>;
  getAllContactInfo(): Promise<any>;
}
