import { Injectable } from '@nestjs/common';
import { randomBytes, scrypt, createCipheriv, createDecipheriv } from 'crypto';
import { promisify } from 'util';
import { IEncryptService } from 'src/domain/adapters/encrypt.interface';

@Injectable()
export class EncryptService implements IEncryptService {
  private readonly algorithm = 'aes-256-ctr';
  private readonly iv: Buffer;
  private readonly salt = 'salt';
  private readonly keyLength = 32; // 256 bits
  private readonly password = 'qwertyuiopasdfghjklzxcvbnm123456';

  constructor() {
    this.iv = randomBytes(16);
  }

  async encrypt(text: string): Promise<Buffer> {
    const key = await this.generateKey(this.password);
    const cipher = createCipheriv(this.algorithm, key, this.iv);
    return Buffer.concat([cipher.update(text), cipher.final()]);
  }

  async decrypt(encryptedText: Buffer): Promise<string> {
    const key = await this.generateKey(this.password);
    const decipher = createDecipheriv(this.algorithm, key, this.iv);
    return Buffer.concat([
      decipher.update(encryptedText),
      decipher.final(),
    ]).toString();
  }

  private async generateKey(password: string): Promise<Buffer> {
    return promisify(scrypt)(
      password,
      this.salt,
      this.keyLength,
    ) as Promise<Buffer>;
  }
}
