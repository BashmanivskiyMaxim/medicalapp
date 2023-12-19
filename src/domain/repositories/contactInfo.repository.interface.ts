import { ContactInfoModel } from '../model/contactInfoModel';

export interface ContactInfoRepository {
  createContactInfo(contactInfo: any): Promise<any>;
  updateContactInfo(contactInfo: any): Promise<any>;
  deleteContactInfo(contactInfo: ContactInfoModel): Promise<any>;
  getContactInfo(contactInfo: any): Promise<any>;
}
