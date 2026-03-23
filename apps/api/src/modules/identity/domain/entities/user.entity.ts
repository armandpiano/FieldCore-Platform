import { Entity } from '../../../shared/domain/base/entity';
import { Email } from '../value-objects/email.value-object';
import { Password } from '../value-objects/password.value-object';

export enum UserRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  SUPERVISOR = 'supervisor',
  TECHNICIAN = 'technician',
}

export interface UserProps {
  email: Email;
  password: Password;
  firstName: string;
  lastName: string;
  role: UserRole;
  organizationId: string;
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class UserEntity extends Entity<UserProps> {
  private constructor(props: UserProps, id?: string) {
    super(props, id);
  }

  static create(props: UserProps, id?: string): UserEntity {
    const user = new UserEntity(
      {
        ...props,
        createdAt: props.createdAt || new Date(),
        updatedAt: props.updatedAt || new Date(),
      },
      id,
    );
    return user;
  }

  get email(): Email {
    return this.props.email;
  }

  get password(): Password {
    return this.props.password;
  }

  get firstName(): string {
    return this.props.firstName;
  }

  get lastName(): string {
    return this.props.lastName;
  }

  get fullName(): string {
    return `${this.props.firstName} ${this.props.lastName}`;
  }

  get role(): UserRole {
    return this.props.role;
  }

  get organizationId(): string {
    return this.props.organizationId;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get lastLoginAt(): Date | undefined {
    return this.props.lastLoginAt;
  }

  updateLastLogin(): void {
    this.props.lastLoginAt = new Date();
  }

  deactivate(): void {
    this.props.isActive = false;
    this.touch();
  }

  activate(): void {
    this.props.isActive = true;
    this.touch();
  }

  updatePassword(newPassword: Password): void {
    this.props.password = newPassword;
    this.touch();
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }

  hasRole(role: UserRole): boolean {
    return this.props.role === role;
  }

  hasAnyRole(roles: UserRole[]): boolean {
    return roles.includes(this.props.role);
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

  canManageWorkOrders(): boolean {
    return [UserRole.OWNER, UserRole.ADMIN, UserRole.SUPERVISOR].includes(
      this.props.role,
    );
  }

  canAssignTechnicians(): boolean {
    return [UserRole.OWNER, UserRole.ADMIN, UserRole.SUPERVISOR].includes(
      this.props.role,
    );
  }
}
