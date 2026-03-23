import { Entity } from '../../../shared/domain/base/entity';

export enum OrganizationStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  PENDING = 'pending',
}

export enum PlanType {
  FREE = 'free',
  STARTER = 'starter',
  PROFESSIONAL = 'professional',
  ENTERPRISE = 'enterprise',
}

export interface OrganizationProps {
  name: string;
  slug: string;
  status: OrganizationStatus;
  plan: PlanType;
  logoUrl?: string;
  address?: string;
  phone?: string;
  timezone: string;
  settings: OrganizationSettings;
  maxUsers: number;
  maxTechnicians: number;
  maxStorageMb: number;
  currentStorageMb: number;
  subscriptionExpiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrganizationSettings {
  allowTechnicianApp: boolean;
  requireClientSignature: boolean;
  enableOfflineMode: boolean;
  slaHours: number;
  autoAssignEnabled: boolean;
  notifyOnClose: boolean;
}

export class OrganizationEntity extends Entity<OrganizationProps> {
  private constructor(props: OrganizationProps, id?: string) {
    super(props, id);
  }

  static create(props: Partial<OrganizationProps> & { name: string; slug: string }): OrganizationEntity {
    return new OrganizationEntity({
      name: props.name,
      slug: props.slug,
      status: props.status || OrganizationStatus.PENDING,
      plan: props.plan || PlanType.FREE,
      logoUrl: props.logoUrl,
      address: props.address,
      phone: props.phone,
      timezone: props.timezone || 'America/Mexico_City',
      settings: props.settings || {
        allowTechnicianApp: true,
        requireClientSignature: true,
        enableOfflineMode: true,
        slaHours: 24,
        autoAssignEnabled: false,
        notifyOnClose: true,
      },
      maxUsers: props.maxUsers || 5,
      maxTechnicians: props.maxTechnicians || 10,
      maxStorageMb: props.maxStorageMb || 100,
      currentStorageMb: props.currentStorageMb || 0,
      subscriptionExpiresAt: props.subscriptionExpiresAt,
      createdAt: props.createdAt || new Date(),
      updatedAt: props.updatedAt || new Date(),
    });
  }

  get name(): string {
    return this.props.name;
  }

  get slug(): string {
    return this.props.slug;
  }

  get status(): OrganizationStatus {
    return this.props.status;
  }

  get plan(): PlanType {
    return this.props.plan;
  }

  get timezone(): string {
    return this.props.timezone;
  }

  get settings(): OrganizationSettings {
    return this.props.settings;
  }

  get maxUsers(): number {
    return this.props.maxUsers;
  }

  get maxTechnicians(): number {
    return this.props.maxTechnicians;
  }

  isActive(): boolean {
    return this.props.status === OrganizationStatus.ACTIVE;
  }

  isSuspended(): boolean {
    return this.props.status === OrganizationStatus.SUSPENDED;
  }

  activate(): void {
    this.props.status = OrganizationStatus.ACTIVE;
    this.touch();
  }

  suspend(): void {
    this.props.status = OrganizationStatus.SUSPENDED;
    this.touch();
  }

  updateSettings(settings: Partial<OrganizationSettings>): void {
    this.props.settings = { ...this.props.settings, ...settings };
    this.touch();
  }

  updatePlan(plan: PlanType, maxUsers: number, maxTechnicians: number, maxStorageMb: number): void {
    this.props.plan = plan;
    this.props.maxUsers = maxUsers;
    this.props.maxTechnicians = maxTechnicians;
    this.props.maxStorageMb = maxStorageMb;
    this.touch();
  }

  addStorage(mb: number): void {
    this.props.currentStorageMb += mb;
    this.touch();
  }

  canAddUser(currentUserCount: number): boolean {
    return currentUserCount < this.props.maxUsers;
  }

  canAddTechnician(currentTechCount: number): boolean {
    return currentTechCount < this.props.maxTechnicians;
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }
}
