import { Entity } from '../../../shared/domain/base/entity';

export enum ContactRole {
  PRIMARY = 'primary',
  BILLING = 'billing',
  TECHNICAL = 'technical',
  EMERGENCY = 'emergency',
  OPERATIONAL = 'operational',
}

export interface ContactProps {
  clientId: string;
  organizationId: string;
  firstName: string;
  lastName: string;
  role: ContactRole;
  email?: string;
  phone?: string;
  mobilePhone?: string;
  position?: string;
  department?: string;
  isPrimary: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class ClientContactEntity extends Entity<ContactProps> {
  private constructor(props: ContactProps, id?: string) {
    super(props, id);
  }

  static create(props: ContactProps, id?: string): ClientContactEntity {
    return new ClientContactEntity(
      {
        ...props,
        createdAt: props.createdAt || new Date(),
        updatedAt: props.updatedAt || new Date(),
      },
      id,
    );
  }

  static createPrimary(
    clientId: string,
    organizationId: string,
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
  ): ClientContactEntity {
    return ClientContactEntity.create({
      clientId,
      organizationId,
      firstName,
      lastName,
      role: ContactRole.PRIMARY,
      email,
      phone,
      isPrimary: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  get clientId(): string {
    return this.props.clientId;
  }

  get organizationId(): string {
    return this.props.organizationId;
  }

  get fullName(): string {
    return `${this.props.firstName} ${this.props.lastName}`;
  }

  get isPrimary(): boolean {
    return this.props.isPrimary;
  }

  get role(): ContactRole {
    return this.props.role;
  }

  update(data: Partial<ContactProps>): void {
    Object.assign(this.props, data);
    this.touch();
  }

  setAsPrimary(): void {
    this.props.isPrimary = true;
    this.touch();
  }

  unsetAsPrimary(): void {
    this.props.isPrimary = false;
    this.touch();
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }
}
