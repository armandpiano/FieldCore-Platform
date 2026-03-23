import { Entity } from '../../../shared/domain/base/entity';

export enum ClientType {
  COMPANY = 'company',
  INDIVIDUAL = 'individual',
}

export enum ClientStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PROSPECT = 'prospect',
}

export interface ClientProps {
  organizationId: string;
  type: ClientType;
  status: ClientStatus;
  
  // Company info
  businessName?: string;
  tradeName?: string;
  rfc?: string;
  taxRegime?: string;
  
  // Individual info
  firstName?: string;
  lastName?: string;
  curp?: string;
  
  // Contact
  email?: string;
  phone?: string;
  secondaryPhone?: string;
  
  // Address
  street?: string;
  exteriorNumber?: string;
  interiorNumber?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  
  // Metadata
  notes?: string;
  internalCode?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

export class ClientEntity extends Entity<ClientProps> {
  private constructor(props: ClientProps, id?: string) {
    super(props, id);
  }

  static create(props: ClientProps, id?: string): ClientEntity {
    return new ClientEntity(
      {
        ...props,
        country: props.country || 'MX',
        createdAt: props.createdAt || new Date(),
        updatedAt: props.updatedAt || new Date(),
      },
      id,
    );
  }

  static createCompany(
    organizationId: string,
    businessName: string,
    rfc?: string,
  ): ClientEntity {
    return ClientEntity.create({
      organizationId,
      type: ClientType.COMPANY,
      status: ClientStatus.ACTIVE,
      businessName,
      rfc,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static createIndividual(
    organizationId: string,
    firstName: string,
    lastName: string,
  ): ClientEntity {
    return ClientEntity.create({
      organizationId,
      type: ClientType.INDIVIDUAL,
      status: ClientStatus.ACTIVE,
      firstName,
      lastName,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  get organizationId(): string {
    return this.props.organizationId;
  }

  get type(): ClientType {
    return this.props.type;
  }

  get status(): ClientStatus {
    return this.props.status;
  }

  get displayName(): string {
    if (this.props.type === ClientType.COMPANY) {
      return this.props.tradeName || this.props.businessName || '';
    }
    return `${this.props.firstName} ${this.props.lastName}`;
  }

  get fullAddress(): string {
    const parts = [
      this.props.street,
      this.props.exteriorNumber,
      this.props.interiorNumber ? `Int. ${this.props.interiorNumber}` : null,
      this.props.neighborhood,
      this.props.city,
      this.props.state,
      this.props.postalCode,
    ].filter(Boolean);
    return parts.join(', ');
  }

  get isActive(): boolean {
    return this.props.status === ClientStatus.ACTIVE;
  }

  get isCompany(): boolean {
    return this.props.type === ClientType.COMPANY;
  }

  activate(): void {
    this.props.status = ClientStatus.ACTIVE;
    this.touch();
  }

  deactivate(): void {
    this.props.status = ClientStatus.INACTIVE;
    this.touch();
  }

  markAsProspect(): void {
    this.props.status = ClientStatus.PROSPECT;
    this.touch();
  }

  update(data: Partial<ClientProps>): void {
    Object.assign(this.props, data);
    this.touch();
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }
}
