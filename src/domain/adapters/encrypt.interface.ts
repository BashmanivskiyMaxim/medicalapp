export interface IEncryptService {
  encrypt(data: string): Promise<string>;
  decrypt(encryptedData: string): Promise<string>;
}
