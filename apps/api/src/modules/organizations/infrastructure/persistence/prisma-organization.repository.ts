import { Injectable } from '@nestjs/common';
import { OrganizationEntity, OrganizationStatus, PlanType } from '../../domain/entities/organization.entity';
import { OrganizationRepositoryInterface } from '../../domain/repositories/organization.repository.interface';
import { PrismaService } from '../../../../shared/infrastructure/database/prisma.service';
import { Organization } from '@prisma/client';

@Injectable()
export class PrismaOrganizationRepository implements OrganizationRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<OrganizationEntity | null> {
    const org = await this.prisma.organization.findUnique({ where: { id } });
    if (!org) return null;
    return this.mapToEntity(org);
  }

  async findBySlug(slug: string): Promise<OrganizationEntity | null> {
    const org = await this.prisma.organization.findUnique({ where: { slug } });
    if (!org) return null;
    return this.mapToEntity(org);
  }

  async findByOwnerId(ownerId: string): Promise<OrganizationEntity | null> {
    const org = await this.prisma.organization.findFirst({
      where: { ownerId },
    });
    if (!org) return null;
    return this.mapToEntity(org);
  }

  async findAll(page: number, limit: number): Promise<{ organizations: OrganizationEntity[]; total: number }> {
    const [orgs, total] = await this.prisma.$transaction([
      this.prisma.organization.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.organization.count(),
    ]);
    return { organizations: orgs.map(o => this.mapToEntity(o)), total };
  }

  async existsBySlug(slug: string): Promise<boolean> {
    const count = await this.prisma.organization.count({ where: { slug } });
    return count > 0;
  }

  async save(organization: OrganizationEntity): Promise<OrganizationEntity> {
    const data = {
      name: organization.name,
      slug: organization.slug,
      status: organization.status,
      plan: organization.plan,
      logoUrl: organization.props.logoUrl,
      address: organization.props.address,
      phone: organization.props.phone,
      timezone: organization.timezone,
      settings: organization.settings as any,
      maxUsers: organization.maxUsers,
      maxTechnicians: organization.maxTechnicians,
      maxStorageMb: organization.props.maxStorageMb,
      currentStorageMb: organization.props.currentStorageMb,
      subscriptionExpiresAt: organization.props.subscriptionExpiresAt,
    };

    const saved = await this.prisma.organization.create({ data });
    return this.mapToEntity(saved);
  }

  async update(organization: OrganizationEntity): Promise<OrganizationEntity> {
    const data = {
      name: organization.name,
      slug: organization.slug,
      status: organization.status,
      plan: organization.plan,
      logoUrl: organization.props.logoUrl,
      address: organization.props.address,
      phone: organization.props.phone,
      timezone: organization.timezone,
      settings: organization.settings as any,
      maxUsers: organization.maxUsers,
      maxTechnicians: organization.maxTechnicians,
      maxStorageMb: organization.props.maxStorageMb,
      currentStorageMb: organization.props.currentStorageMb,
      subscriptionExpiresAt: organization.props.subscriptionExpiresAt,
      updatedAt: new Date(),
    };

    const updated = await this.prisma.organization.update({
      where: { id: organization.id },
      data,
    });
    return this.mapToEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.organization.delete({ where: { id } });
  }

  private mapToEntity(org: Organization): OrganizationEntity {
    return OrganizationEntity.create(
      {
        name: org.name,
        slug: org.slug,
        status: org.status as OrganizationStatus,
        plan: org.plan as PlanType,
        logoUrl: org.logoUrl || undefined,
        address: org.address || undefined,
        phone: org.phone || undefined,
        timezone: org.timezone,
        settings: typeof org.settings === 'object' ? org.settings as any : {},
        maxUsers: org.maxUsers,
        maxTechnicians: org.maxTechnicians,
        maxStorageMb: org.maxStorageMb,
        currentStorageMb: org.currentStorageMb,
        subscriptionExpiresAt: org.subscriptionExpiresAt || undefined,
        createdAt: org.createdAt,
        updatedAt: org.updatedAt,
      },
      org.id,
    );
  }
}
