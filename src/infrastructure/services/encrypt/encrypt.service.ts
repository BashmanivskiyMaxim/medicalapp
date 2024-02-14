import { Injectable } from '@nestjs/common';
import { randomBytes, scrypt, createCipheriv, createDecipheriv } from 'crypto';
import { promisify } from 'util';
import { IEncryptService } from 'src/domain/adapters/encrypt.interface';

@Injectable()
export class EncryptService implements IEncryptService {
  private readonly algorithm = 'aes-256-ctr';
  private readonly password = 'd6F3Efeqqwertyuiopasdfghjklzxcvbnm';

  async encrypt(text: string): Promise<Buffer> {
    const iv = randomBytes(16);
    const key = await this.generateKey(this.password);

    const cipher = createCipheriv(this.algorithm, key, iv);
    const encryptedText = Buffer.concat([cipher.update(text), cipher.final()]);

    return Buffer.concat([iv, encryptedText]);
  }

  async decrypt(encryptedText: Buffer): Promise<string> {
    const iv = encryptedText.slice(0, 16);
    const key = await this.generateKey(this.password);

    const decipher = createDecipheriv(this.algorithm, key, iv);
    const decryptedText = Buffer.concat([
      decipher.update(encryptedText.slice(16)),
      decipher.final(),
    ]);

    return decryptedText.toString();
  }

  private async generateKey(password: string): Promise<Buffer> {
    const salt = 'salt';
    const keyLength = 32;
    return promisify(scrypt)(password, salt, keyLength);
  }
}
