import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { OrganizationEntity, OrganizationStatus } from '../../domain/entities/organization.entity';
import { MembershipEntity } from '../../domain/entities/membership.entity';
import { UserEntity, UserRole } from '../../../identity/domain/entities/user.entity';
import { OrganizationRepositoryInterface } from '../../domain/repositories/organization.repository.interface';
import { MembershipRepositoryInterface } from '../../domain/repositories/membership.repository.interface';
import { CreateOrganizationDto, UpdateOrganizationDto, OrganizationResponseDto } from '../dto/organization.dto';
import { Password } from '../../../identity/domain/value-objects/password.value-object';
import { Email } from '../../../identity/domain/value-objects/email.value-object';

@Injectable()
export class OrganizationService {
  constructor(
    private readonly organizationRepository: OrganizationRepositoryInterface,
    private readonly membershipRepository: MembershipRepositoryInterface,
  ) {}

  async createOrganization(
    createDto: CreateOrganizationDto,
    ownerData: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
    },
  ): Promise<{ organization: OrganizationEntity; owner: UserEntity }> {
    // Validate slug format
    const slugRegex = /^[a-z0-9-]+$/;
    if (!slugRegex.test(createDto.slug)) {
      throw new BadRequestException('Slug must contain only lowercase letters, numbers, and hyphens');
    }

    // Check if slug is available
    const slugExists = await this.organizationRepository.existsBySlug(createDto.slug);
    if (slugExists) {
      throw new BadRequestException('Organization slug is already taken');
    }

    // Create organization
    const organization = OrganizationEntity.create({
      name: createDto.name,
      slug: createDto.slug,
      address: createDto.address,
      phone: createDto.phone,
      timezone: createDto.timezone || 'America/Mexico_City',
    });

    const savedOrganization = await this.organizationRepository.save(organization);

    // Create owner user
    const ownerPassword = await Password.create(ownerData.password);
    const ownerEmail = Email.create(ownerData.email);

    const owner = UserEntity.create({
      email: ownerEmail,
      password: ownerPassword,
      firstName: ownerData.firstName,
      lastName: ownerData.lastName,
      role: UserRole.OWNER,
      organizationId: savedOrganization.id,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return { organization: savedOrganization, owner };
  }

  async getOrganization(id: string): Promise<OrganizationEntity> {
    const organization = await this.organizationRepository.findById(id);
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }
    return organization;
  }

  async getOrganizationBySlug(slug: string): Promise<OrganizationEntity> {
    const organization = await this.organizationRepository.findBySlug(slug);
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }
    return organization;
  }

  async updateOrganization(
    id: string,
    updateDto: UpdateOrganizationDto,
    requestingUserId: string,
  ): Promise<OrganizationEntity> {
    const organization = await this.organizationRepository.findById(id);
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    // Verify user is owner or admin of this organization
    const membership = await this.membershipRepository.findByUserAndOrganization(
      requestingUserId,
      id,
    );
    if (!membership || !membership.canManageUsers()) {
      throw new ForbiddenException('You do not have permission to update this organization');
    }

    if (updateDto.name) organization.props.name = updateDto.name;
    if (updateDto.address) organization.props.address = updateDto.address;
    if (updateDto.phone) organization.props.phone = updateDto.phone;
    if (updateDto.timezone) organization.props.timezone = updateDto.timezone;

    return this.organizationRepository.update(organization);
  }

  async activateOrganization(id: string): Promise<OrganizationEntity> {
    const organization = await this.organizationRepository.findById(id);
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }
    organization.activate();
    return this.organizationRepository.update(organization);
  }

  async suspendOrganization(id: string): Promise<OrganizationEntity> {
    const organization = await this.organizationRepository.findById(id);
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }
    organization.suspend();
    return this.organizationRepository.update(organization);
  }

  async getOrganizationStats(organizationId: string): Promise<{
    totalUsers: number;
    activeUsers: number;
    totalTechnicians: number;
    storageUsedMb: number;
    storageLimitMb: number;
  }> {
    const memberships = await this.membershipRepository.findActiveByOrganization(organizationId);
    const organization = await this.organizationRepository.findById(organizationId);

    const technicians = memberships.filter(m => m.isTechnician());

    return {
      totalUsers: memberships.length,
      activeUsers: memberships.filter(m => m.isActive).length,
      totalTechnicians: technicians.length,
      storageUsedMb: organization?.props.currentStorageMb || 0,
      storageLimitMb: organization?.props.maxStorageMb || 0,
    };
  }

  private toResponse(organization: OrganizationEntity): OrganizationResponseDto {
    return {
      id: organization.id,
      name: organization.name,
      slug: organization.slug,
      status: organization.status,
      plan: organization.plan,
      logoUrl: organization.props.logoUrl,
      address: organization.props.address,
      phone: organization.props.phone,
      timezone: organization.timezone,
      maxUsers: organization.maxUsers,
      maxTechnicians: organization.maxTechnicians,
      maxStorageMb: organization.props.maxStorageMb,
      currentStorageMb: organization.props.currentStorageMb,
      subscriptionExpiresAt: organization.props.subscriptionExpiresAt,
      createdAt: organization.props.createdAt,
      updatedAt: organization.props.updatedAt,
    };
  }
}
