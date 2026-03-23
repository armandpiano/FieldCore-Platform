import { Entity } from '../../../shared/domain/base/entity';
import { UserRole } from '../../identity/domain/entities/user.entity';

export enum InvitationStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
}

export interface InvitationProps {
  email: string;
  organizationId: string;
  organizationName: string;
  role: UserRole;
  status: InvitationStatus;
  invitedBy: string;
  token: string;
  expiresAt: Date;
  acceptedAt?: Date;
  cancelledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class InvitationEntity extends Entity<InvitationProps> {
  private constructor(props: InvitationProps, id?: string) {
    super(props, id);
  }

  static create(
    email: string,
    organizationId: string,
    organizationName: string,
    role: UserRole,
    invitedBy: string,
    token: string,
    expiresInDays: number = 7,
  ): InvitationEntity {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    return InvitationEntity.create({
      email: email.toLowerCase().trim(),
      organizationId,
      organizationName,
      role,
      status: InvitationStatus.PENDING,
      invitedBy,
      token,
      expiresAt,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  get email(): string {
    return this.props.email;
  }

  get organizationId(): string {
    return this.props.organizationId;
  }

  get organizationName(): string {
    return this.props.organizationName;
  }

  get role(): UserRole {
    return this.props.role;
  }

  get status(): InvitationStatus {
    return this.props.status;
  }

  get token(): string {
    return this.props.token;
  }

  get expiresAt(): Date {
    return this.props.expiresAt;
  }

  get isPending(): boolean {
    return this.props.status === InvitationStatus.PENDING;
  }

  get isExpired(): boolean {
    return new Date() > this.props.expiresAt;
  }

  accept(): void {
    if (this.isExpired) {
      throw new Error('Invitation has expired');
    }
    if (!this.isPending) {
      throw new Error('Invitation is not pending');
    }
    this.props.status = InvitationStatus.ACCEPTED;
    this.props.acceptedAt = new Date();
    this.touch();
  }

  expire(): void {
    this.props.status = InvitationStatus.EXPIRED;
    this.touch();
  }

  cancel(): void {
    if (!this.isPending) {
      throw new Error('Cannot cancel non-pending invitation');
    }
    this.props.status = InvitationStatus.CANCELLED;
    this.props.cancelledAt = new Date();
    this.touch();
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }
}
