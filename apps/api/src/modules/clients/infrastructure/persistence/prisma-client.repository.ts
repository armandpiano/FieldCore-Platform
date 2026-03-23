import { Injectable } from '@nestjs/common';
import { ClientEntity, ClientType, ClientStatus } from '../../domain/entities/client.entity';
import { ClientRepositoryInterface, ClientFilter } from '../../domain/repositories/client.repository.interface';
import { PrismaService } from '../../../shared/infrastructure/database/prisma.service';
import { Prisma, Client } from '@prisma/client';

@Injectable()
export class PrismaClientRepository implements ClientRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<ClientEntity | null> {
    const client = await this.prisma.client.findUnique({ where: { id } });
    if (!client) return null;
    return this.mapToEntity(client);
  }

  async findByOrganization(
    organizationId: string,
    filter?: ClientFilter,
    page: number = 1,
    limit: number = 20,
  ): Promise<{ clients: ClientEntity[]; total: number }> {
    const where: Prisma.ClientWhereInput = {
      organizationId,
    };

    if (filter?.status) {
      where.status = filter.status;
    }

    if (filter?.search) {
      where.OR = [
        { businessName: { contains: filter.search, mode: 'insensitive' } },
        { tradeName: { contains: filter.search, mode: 'insensitive' } },
        { firstName: { contains: filter.search, mode: 'insensitive' } },
        { lastName: { contains: filter.search, mode: 'insensitive' } },
        { email: { contains: filter.search, mode: 'insensitive' } },
        { internalCode: { contains: filter.search, mode: 'insensitive' } },
      ];
    }

    const [clients, total] = await this.prisma.$transaction([
      this.prisma.client.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.client.count({ where }),
    ]);

    return { clients: clients.map(c => this.mapToEntity(c)), total };
  }

  async findByInternalCode(organizationId: string, internalCode: string): Promise<ClientEntity | null> {
    const client = await this.prisma.client.findFirst({
      where: { organizationId, internalCode },
    });
    if (!client) return null;
    return this.mapToEntity(client);
  }

  async findByRFC(organizationId: string, rfc: string): Promise<ClientEntity | null> {
    const client = await this.prisma.client.findFirst({
      where: { organizationId, rfc },
    });
    if (!client) return null;
    return this.mapToEntity(client);
  }

  async existsByInternalCode(organizationId: string, internalCode: string): Promise<boolean> {
    const count = await this.prisma.client.count({
      where: { organizationId, internalCode },
    });
    return count > 0;
  }

  async save(client: ClientEntity): Promise<ClientEntity> {
    const saved = await this.prisma.client.create({
      data: this.mapToPrisma(client),
    });
    return this.mapToEntity(saved);
  }

  async update(client: ClientEntity): Promise<ClientEntity> {
    const updated = await this.prisma.client.update({
      where: { id: client.id },
      data: {
        ...this.mapToPrisma(client),
        updatedAt: new Date(),
      },
    });
    return this.mapToEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.client.delete({ where: { id } });
  }

  private mapToEntity(client: Client): ClientEntity {
    return ClientEntity.create(
      {
        organizationId: client.organizationId,
        type: client.type as ClientType,
        status: client.status as ClientStatus,
        businessName: client.businessName || undefined,
        tradeName: client.tradeName || undefined,
        rfc: client.rfc || undefined,
        taxRegime: client.taxRegime || undefined,
        firstName: client.firstName || undefined,
        lastName: client.lastName || undefined,
        email: client.email || undefined,
        phone: client.phone || undefined,
        secondaryPhone: client.secondaryPhone || undefined,
        street: client.street || undefined,
        exteriorNumber: client.exteriorNumber || undefined,
        interiorNumber: client.interiorNumber || undefined,
        neighborhood: client.neighborhood || undefined,
        city: client.city || undefined,
        state: client.state || undefined,
        postalCode: client.postalCode || undefined,
        country: client.country || undefined,
        notes: client.notes || undefined,
        internalCode: client.internalCode || undefined,
        createdAt: client.createdAt,
        updatedAt: client.updatedAt,
      },
      client.id,
    );
  }

  private mapToPrisma(client: ClientEntity): Prisma.ClientCreateInput {
    return {
      organizationId: client.organizationId,
      type: client.type,
      status: client.status,
      businessName: client.props.businessName,
      tradeName: client.props.tradeName,
      rfc: client.props.rfc,
      taxRegime: client.props.taxRegime,
      firstName: client.props.firstName,
      lastName: client.props.lastName,
      email: client.props.email,
      phone: client.props.phone,
      secondaryPhone: client.props.secondaryPhone,
      street: client.props.street,
      exteriorNumber: client.props.exteriorNumber,
      interiorNumber: client.props.interiorNumber,
      neighborhood: client.props.neighborhood,
      city: client.props.city,
      state: client.props.state,
      postalCode: client.props.postalCode,
      country: client.props.country,
      notes: client.props.notes,
      internalCode: client.props.internalCode,
    };
  }
}
