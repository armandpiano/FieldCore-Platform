import { Injectable } from '@nestjs/common';
import { ClientSiteEntity, SiteType } from '../../domain/entities/client-site.entity';
import { SiteRepositoryInterface } from '../../domain/repositories/client-site.repository.interface';
import { PrismaService } from '../../../shared/infrastructure/database/prisma.service';
import { Prisma, ClientSite } from '@prisma/client';

@Injectable()
export class PrismaSiteRepository implements SiteRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<ClientSiteEntity | null> {
    const site = await this.prisma.clientSite.findUnique({ where: { id } });
    if (!site) return null;
    return this.mapToEntity(site);
  }

  async findByClient(clientId: string): Promise<ClientSiteEntity[]> {
    const sites = await this.prisma.clientSite.findMany({
      where: { clientId },
      orderBy: [{ isMain: 'desc' }, { createdAt: 'asc' }],
    });
    return sites.map(s => this.mapToEntity(s));
  }

  async findMainSite(clientId: string): Promise<ClientSiteEntity | null> {
    const site = await this.prisma.clientSite.findFirst({
      where: { clientId, isMain: true },
    });
    if (!site) return null;
    return this.mapToEntity(site);
  }

  async findByOrganization(
    organizationId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<{ sites: ClientSiteEntity[]; total: number }> {
    const [sites, total] = await this.prisma.$transaction([
      this.prisma.clientSite.findMany({
        where: { organizationId },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.clientSite.count({ where: { organizationId } }),
    ]);
    return { sites: sites.map(s => this.mapToEntity(s)), total };
  }

  async countByClient(clientId: string): Promise<number> {
    return this.prisma.clientSite.count({ where: { clientId } });
  }

  async save(site: ClientSiteEntity): Promise<ClientSiteEntity> {
    const saved = await this.prisma.clientSite.create({
      data: this.mapToPrisma(site),
    });
    return this.mapToEntity(saved);
  }

  async update(site: ClientSiteEntity): Promise<ClientSiteEntity> {
    const updated = await this.prisma.clientSite.update({
      where: { id: site.id },
      data: {
        ...this.mapToPrisma(site),
        updatedAt: new Date(),
      },
    });
    return this.mapToEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.clientSite.delete({ where: { id } });
  }

  async deleteByClient(clientId: string): Promise<void> {
    await this.prisma.clientSite.deleteMany({ where: { clientId } });
  }

  private mapToEntity(site: ClientSite): ClientSiteEntity {
    return ClientSiteEntity.create(
      {
        clientId: site.clientId,
        organizationId: site.organizationId,
        name: site.name,
        type: site.type as SiteType,
        isMain: site.isMain,
        street: site.street || undefined,
        exteriorNumber: site.exteriorNumber || undefined,
        interiorNumber: site.interiorNumber || undefined,
        neighborhood: site.neighborhood || undefined,
        city: site.city || undefined,
        state: site.state || undefined,
        postalCode: site.postalCode || undefined,
        country: site.country || undefined,
        latitude: site.latitude || undefined,
        longitude: site.longitude || undefined,
        contactName: site.contactName || undefined,
        contactPhone: site.contactPhone || undefined,
        contactEmail: site.contactEmail || undefined,
        accessInstructions: site.accessInstructions || undefined,
        securityInstructions: site.securityInstructions || undefined,
        workingHours: site.workingHours || undefined,
        notes: site.notes || undefined,
        createdAt: site.createdAt,
        updatedAt: site.updatedAt,
      },
      site.id,
    );
  }

  private mapToPrisma(site: ClientSiteEntity): Prisma.ClientSiteCreateInput {
    return {
      clientId: site.clientId,
      organizationId: site.organizationId,
      name: site.name,
      type: site.type,
      isMain: site.isMain,
      street: site.props.street,
      exteriorNumber: site.props.exteriorNumber,
      interiorNumber: site.props.interiorNumber,
      neighborhood: site.props.neighborhood,
      city: site.props.city,
      state: site.props.state,
      postalCode: site.props.postalCode,
      country: site.props.country,
      latitude: site.props.latitude,
      longitude: site.props.longitude,
      contactName: site.props.contactName,
      contactPhone: site.props.contactPhone,
      contactEmail: site.props.contactEmail,
      accessInstructions: site.props.accessInstructions,
      securityInstructions: site.props.securityInstructions,
      workingHours: site.props.workingHours,
      notes: site.props.notes,
    };
  }
}
