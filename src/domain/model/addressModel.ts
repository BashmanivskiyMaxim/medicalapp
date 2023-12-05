export class AddressModel {
  id: number;
  address: string;
  accountId: number;

  constructor(id: number, address: string, accountId: number) {
    this.id = id;
    this.address = address;
    this.accountId = accountId;
  }
}
