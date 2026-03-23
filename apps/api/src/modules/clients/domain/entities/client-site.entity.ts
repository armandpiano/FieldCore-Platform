import { Entity } from '../../../shared/domain/base/entity';

export enum SiteType {
  HEADQUARTERS = 'headquarters',
  BRANCH = 'branch',
  WAREHOUSE = 'warehouse',
  RETAIL = 'retail',
  FACTORY = 'factory',
  OTHER = 'other',
}

export interface SiteProps {
  clientId: string;
  organizationId: string;
  name: string;
  type: SiteType;
  isMain: boolean;
  
  // Location
  street?: string;
  exteriorNumber?: string;
  interiorNumber?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  
  // Coordinates
  latitude?: number;
  longitude?: number;
  
  // Contact at site
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  
  // Instructions
  accessInstructions?: string;
  securityInstructions?: string;
  workingHours?: string;
  
  // Metadata
  notes?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

export class ClientSiteEntity extends Entity<SiteProps> {
  private constructor(props: SiteProps, id?: string) {
    super(props, id);
  }

  static create(props: SiteProps, id?: string): ClientSiteEntity {
    return new ClientSiteEntity(
      {
        ...props,
        country: props.country || 'MX',
        createdAt: props.createdAt || new Date(),
        updatedAt: props.updatedAt || new Date(),
      },
      id,
    );
  }

  static createMainSite(
    clientId: string,
    organizationId: string,
    name: string,
    address: {
      street?: string;
      exteriorNumber?: string;
      city?: string;
      state?: string;
      postalCode?: string;
    },
  ): ClientSiteEntity {
    return ClientSiteEntity.create({
      clientId,
      organizationId,
      name,
      type: SiteType.HEADQUARTERS,
      isMain: true,
      street: address.street,
      exteriorNumber: address.exteriorNumber,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
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

  get name(): string {
    return this.props.name;
  }

  get type(): SiteType {
    return this.props.type;
  }

  get isMain(): boolean {
    return this.props.isMain;
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

  get coordinates(): { latitude: number; longitude: number } | null {
    if (this.props.latitude && this.props.longitude) {
      return { latitude: this.props.latitude, longitude: this.props.longitude };
    }
    return null;
  }

  update(data: Partial<SiteProps>): void {
    Object.assign(this.props, data);
    this.touch();
  }

  setAsMain(): void {
    this.props.isMain = true;
    this.touch();
  }

  unsetAsMain(): void {
    this.props.isMain = false;
    this.touch();
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }
}
