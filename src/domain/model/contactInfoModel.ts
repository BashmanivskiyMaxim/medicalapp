export class ContactInfoModel {
  id: number;
  accountId: number;
  contactNumber: string;

  constructor(id: number, accountId: number, contactNumber: string) {
    this.id = id;
    this.accountId = accountId;
    this.contactNumber = contactNumber;
  }
}
