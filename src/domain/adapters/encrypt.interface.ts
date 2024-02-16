export interface IEncryptService {
  encrypt(text: string): Promise<Buffer>;
  decrypt(encryptedText: Buffer): Promise<string>;
}
