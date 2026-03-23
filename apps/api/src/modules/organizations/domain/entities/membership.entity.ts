import { Entity } from '../../../shared/domain/base/entity';
import { UserRole } from '../../identity/domain/entities/user.entity';

export enum MembershipStatus {
  ACTIVE = 'active',
  PENDING = 'pending',
  INVITED = 'invited',
  SUSPENDED = 'suspended',
}

export interface MembershipProps {
  userId: string;
  organizationId: string;
  role: UserRole;
  status: MembershipStatus;
  invitedBy?: string;
  invitedAt?: Date;
  acceptedAt?: Date;
  suspendedAt?: Date;
  suspendedReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class MembershipEntity extends Entity<MembershipProps> {
  private constructor(props: MembershipProps, id?: string) {
    super(props, id);
  }

  static create(props: MembershipProps, id?: string): MembershipEntity {
    return new MembershipEntity(props, id);
  }

  static createNew(
    userId: string,
    organizationId: string,
    role: UserRole,
    invitedBy?: string,
  ): MembershipEntity {
    return MembershipEntity.create({
      userId,
      organizationId,
      role,
      status: MembershipStatus.PENDING,
      invitedBy,
      invitedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static createFromInvite(
    userId: string,
    organizationId: string,
    role: UserRole,
    invitedBy: string,
  ): MembershipEntity {
    return MembershipEntity.create({
      userId,
      organizationId,
      role,
      status: MembershipStatus.INVITED,
      invitedBy,
      invitedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  get userId(): string {
    return this.props.userId;
  }

  get organizationId(): string {
    return this.props.organizationId;
  }

  get role(): UserRole {
    return this.props.role;
  }

  get status(): MembershipStatus {
    return this.props.status;
  }

  get isActive(): boolean {
    return this.props.status === MembershipStatus.ACTIVE;
  }

  get isPending(): boolean {
    return this.props.status === MembershipStatus.PENDING;
  }

  get isInvited(): boolean {
    return this.props.status === MembershipStatus.INVITED;
  }

  accept(): void {
    if (this.props.status !== MembershipStatus.PENDING && this.props.status !== MembershipStatus.INVITED) {
      throw new Error('Cannot accept membership that is not pending or invited');
    }
    this.props.status = MembershipStatus.ACTIVE;
    this.props.acceptedAt = new Date();
    this.touch();
  }

  suspend(reason?: string): void {
    this.props.status = MembershipStatus.SUSPENDED;
    this.props.suspendedAt = new Date();
    this.props.suspendedReason = reason;
    this.touch();
  }

  reactivate(): void {
    if (this.props.status !== MembershipStatus.SUSPENDED) {
      throw new Error('Cannot reactivate membership that is not suspended');
    }
    this.props.status = MembershipStatus.ACTIVE;
    this.touch();
  }

  changeRole(newRole: UserRole): void {
    if (this.props.userId === this.props.organizationId) {
      throw new Error('Cannot change role of organization owner');
    }
    this.props.role = newRole;
    this.touch();
  }

  isOwner(): boolean {
    return this.props.role === UserRole.OWNER;
  }

  isAdmin(): boolean {
    return this.props.role === UserRole.ADMIN;
  }

  isSupervisor(): boolean {
    return this.props.role === UserRole.SUPERVISOR;
  }

  isTechnician(): boolean {
    return this.props.role === UserRole.TECHNICIAN;
  }

  canManageUsers(): boolean {
    return [UserRole.OWNER, UserRole.ADMIN].includes(this.props.role);
  }

  canManageMemberships(): boolean {
    return [UserRole.OWNER, UserRole.ADMIN].includes(this.props.role);
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }
}
