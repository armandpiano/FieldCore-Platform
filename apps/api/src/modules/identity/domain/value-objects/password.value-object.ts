import * as bcrypt from 'bcrypt';

export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;
export const BCRYPT_ROUNDS = 12;

export class Password {
  private readonly _hash: string;
  private readonly _plain?: string;

  private constructor(hash: string, plain?: string) {
    this._hash = hash;
    this._plain = plain;
  }

  static async create(plainPassword: string): Promise<Password> {
    if (!plainPassword || typeof plainPassword !== 'string') {
      throw new Error('Password is required');
    }

    if (plainPassword.length < PASSWORD_MIN_LENGTH) {
      throw new Error(
        `Password must be at least ${PASSWORD_MIN_LENGTH} characters long`,
      );
    }

    if (plainPassword.length > PASSWORD_MAX_LENGTH) {
      throw new Error(
        `Password must not exceed ${PASSWORD_MAX_LENGTH} characters`,
      );
    }

    const hash = await bcrypt.hash(plainPassword, BCRYPT_ROUNDS);
    return new Password(hash, plainPassword);
  }

  static fromHash(hash: string): Password {
    if (!hash || typeof hash !== 'string') {
      throw new Error('Password hash is required');
    }
    return new Password(hash);
  }

  get hash(): string {
    return this._hash;
  }

  async compare(plainPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, this._hash);
  }

  isPlain(): boolean {
    return this._plain !== undefined;
  }

  toString(): string {
    return '[Password]';
  }
}
