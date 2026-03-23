export class Email {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value.toLowerCase().trim();
  }

  static create(value: string): Email {
    if (!value || typeof value !== 'string') {
      throw new Error('Email is required');
    }

    const normalized = value.toLowerCase().trim();

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(normalized)) {
      throw new Error('Invalid email format');
    }

    if (normalized.length > 255) {
      throw new Error('Email must not exceed 255 characters');
    }

    return new Email(normalized);
  }

  get value(): string {
    return this._value;
  }

  equals(other: Email): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
