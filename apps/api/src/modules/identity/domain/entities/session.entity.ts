import { Entity } from '../../../shared/domain/base/entity';

export interface SessionProps {
  userId: string;
  organizationId: string;
  refreshToken: string;
  userAgent?: string;
  ipAddress?: string;
  expiresAt: Date;
  createdAt: Date;
  revokedAt?: Date;
  isRevoked: boolean;
}

export class SessionEntity extends Entity<SessionProps> {
  private constructor(props: SessionProps, id?: string) {
    super(props, id);
  }

  static create(props: SessionProps, id?: string): SessionEntity {
    return new SessionEntity(props, id);
  }

  static createNew(
    userId: string,
    organizationId: string,
    refreshToken: string,
    userAgent?: string,
    ipAddress?: string,
    expiresInDays: number = 7,
  ): SessionEntity {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    return SessionEntity.create({
      userId,
      organizationId,
      refreshToken,
      userAgent,
      ipAddress,
      expiresAt,
      createdAt: new Date(),
      isRevoked: false,
    });
  }

  get userId(): string {
    return this.props.userId;
  }

  get organizationId(): string {
    return this.props.organizationId;
  }

  get refreshToken(): string {
    return this.props.refreshToken;
  }

  get userAgent(): string | undefined {
    return this.props.userAgent;
  }

  get ipAddress(): string | undefined {
    return this.props.ipAddress;
  }

  get expiresAt(): Date {
    return this.props.expiresAt;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get isRevoked(): boolean {
    return this.props.isRevoked;
  }

  get revokedAt(): Date | undefined {
    return this.props.revokedAt;
  }

  isExpired(): boolean {
    return new Date() > this.props.expiresAt;
  }

  isValid(): boolean {
    return !this.props.isRevoked && !this.isExpired();
  }

  revoke(): void {
    if (!this.props.isRevoked) {
      this.props.isRevoked = true;
      this.props.revokedAt = new Date();
    }
  }

  updateRefreshToken(newToken: string, expiresInDays: number = 7): void {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    this.props.refreshToken = newToken;
    this.props.expiresAt = expiresAt;
  }
}
