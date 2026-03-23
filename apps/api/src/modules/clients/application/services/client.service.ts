import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { ClientEntity, ClientType, ClientStatus } from '../../domain/entities/client.entity';
import { ClientRepositoryInterface } from '../../domain/repositories/client.repository.interface';
import { SiteRepositoryInterface } from '../../domain/repositories/client-site.repository.interface';
import { ContactRepositoryInterface } from '../../domain/repositories/client-contact.repository.interface';
import { CreateClientDto, UpdateClientDto, ClientResponseDto, ClientListItemDto, ClientFilterDto } from '../dto/client.dto';
import { CreateClientSiteDto, UpdateClientSiteDto, ClientSiteResponseDto } from '../dto/client-site.dto';
import { CreateClientContactDto, UpdateClientContactDto, ClientContactResponseDto } from '../dto/client-contact.dto';
import { ClientSiteEntity } from '../../domain/entities/client-site.entity';
import { ClientContactEntity } from '../../domain/entities/client-contact.entity';
import { PaginatedResult } from '../../../shared/application/dto/pagination.dto';

@Injectable()
export class ClientService {
  constructor(
    private readonly clientRepository: ClientRepositoryInterface,
    private readonly siteRepository: SiteRepositoryInterface,
    private readonly contactRepository: ContactRepositoryInterface,
  ) {}

  async createClient(
    organizationId: string,
    createDto: CreateClientDto,
  ): Promise<ClientEntity> {
    // Validate company type has required fields
    if (createDto.type === ClientType.COMPANY && !createDto.businessName) {
      throw new BadRequestException('Business name is required for company clients');
    }

    // Validate individual type has required fields
    if (createDto.type === ClientType.INDIVIDUAL && (!createDto.firstName || !createDto.lastName)) {
      throw new BadRequestException('First and last name are required for individual clients');
    }

    // Check for duplicate internal code
    if (createDto.internalCode) {
      const exists = await this.clientRepository.existsByInternalCode(
        organizationId,
        createDto.internalCode,
      );
      if (exists) {
        throw new BadRequestException('Internal code already exists for this organization');
      }
    }

    const client = ClientEntity.create({
      organizationId,
      type: createDto.type,
      status: ClientStatus.ACTIVE,
      businessName: createDto.businessName,
      tradeName: createDto.tradeName,
      rfc: createDto.rfc,
      taxRegime: createDto.taxRegime,
      firstName: createDto.firstName,
      lastName: createDto.lastName,
      email: createDto.email,
      phone: createDto.phone,
      secondaryPhone: createDto.secondaryPhone,
      street: createDto.street,
      exteriorNumber: createDto.exteriorNumber,
      interiorNumber: createDto.interiorNumber,
      neighborhood: createDto.neighborhood,
      city: createDto.city,
      state: createDto.state,
      postalCode: createDto.postalCode,
      country: createDto.country || 'MX',
      notes: createDto.notes,
      internalCode: createDto.internalCode,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return this.clientRepository.save(client);
  }

  async updateClient(
    id: string,
    updateDto: UpdateClientDto,
    organizationId: string,
  ): Promise<ClientEntity> {
    const client = await this.clientRepository.findById(id);
    if (!client) {
      throw new NotFoundException('Client not found');
    }

    if (client.organizationId !== organizationId) {
      throw new NotFoundException('Client not found');
    }

    // Check for duplicate internal code
    if (updateDto.internalCode && updateDto.internalCode !== client.props.internalCode) {
      const exists = await this.clientRepository.existsByInternalCode(
        organizationId,
        updateDto.internalCode,
      );
      if (exists) {
        throw new BadRequestException('Internal code already exists for this organization');
      }
    }

    client.update(updateDto);
    return this.clientRepository.update(client);
  }

  async getClientById(id: string, organizationId: string): Promise<ClientEntity> {
    const client = await this.clientRepository.findById(id);
    if (!client || client.organizationId !== organizationId) {
      throw new NotFoundException('Client not found');
    }
    return client;
  }

  async listClients(
    organizationId: string,
    filterDto: ClientFilterDto,
    page: number = 1,
    limit: number = 20,
  ): Promise<PaginatedResult<ClientListItemDto>> {
    const { clients, total } = await this.clientRepository.findByOrganization(
      organizationId,
      { status: filterDto.status, search: filterDto.search },
      page,
      limit,
    );

    return {
      data: clients.map((c) => ({
        id: c.id,
        displayName: c.displayName,
        type: c.type,
        status: c.status,
        email: c.props.email,
        phone: c.props.phone,
        city: c.props.city,
        state: c.props.state,
        internalCode: c.props.internalCode,
        createdAt: c.props.createdAt,
      })),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async deactivateClient(id: string, organizationId: string): Promise<ClientEntity> {
    const client = await this.getClientById(id, organizationId);
    client.deactivate();
    return this.clientRepository.update(client);
  }

  async activateClient(id: string, organizationId: string): Promise<ClientEntity> {
    const client = await this.getClientById(id, organizationId);
    client.activate();
    return this.clientRepository.update(client);
  }

  async getClientWithDetails(
    id: string,
    organizationId: string,
  ): Promise<{
    client: ClientEntity;
    sites: ClientSiteEntity[];
    contacts: ClientContactEntity[];
  }> {
    const client = await this.getClientById(id, organizationId);
    const sites = await this.siteRepository.findByClient(id);
    const contacts = await this.contactRepository.findByClient(id);

    return { client, sites, contacts };
  }

  // Site operations
  async createSite(
    clientId: string,
    organizationId: string,
    createDto: CreateClientSiteDto,
  ): Promise<ClientSiteEntity> {
    const client = await this.getClientById(clientId, organizationId);

    const siteCount = await this.siteRepository.countByClient(clientId);
    const isMain = siteCount === 0;

    const site = ClientSiteEntity.create({
      clientId,
      organizationId,
      name: createDto.name,
      type: createDto.type,
      isMain,
      street: createDto.street,
      exteriorNumber: createDto.exteriorNumber,
      interiorNumber: createDto.interiorNumber,
      neighborhood: createDto.neighborhood,
      city: createDto.city,
      state: createDto.state,
      postalCode: createDto.postalCode,
      country: createDto.country || 'MX',
      latitude: createDto.latitude,
      longitude: createDto.longitude,
      contactName: createDto.contactName,
      contactPhone: createDto.contactPhone,
      contactEmail: createDto.contactEmail,
      accessInstructions: createDto.accessInstructions,
      securityInstructions: createDto.securityInstructions,
      workingHours: createDto.workingHours,
      notes: createDto.notes,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return this.siteRepository.save(site);
  }

  async updateSite(
    siteId: string,
    updateDto: UpdateClientSiteDto,
    organizationId: string,
  ): Promise<ClientSiteEntity> {
    const site = await this.siteRepository.findById(siteId);
    if (!site || site.organizationId !== organizationId) {
      throw new NotFoundException('Site not found');
    }

    site.update(updateDto);
    return this.siteRepository.update(site);
  }

  async listClientSites(
    clientId: string,
    organizationId: string,
  ): Promise<ClientSiteEntity[]> {
    const client = await this.getClientById(clientId, organizationId);
    return this.siteRepository.findByClient(client.id);
  }

  async getSiteById(siteId: string, organizationId: string): Promise<ClientSiteEntity> {
    const site = await this.siteRepository.findById(siteId);
    if (!site || site.organizationId !== organizationId) {
      throw new NotFoundException('Site not found');
    }
    return site;
  }

  async setMainSite(siteId: string, organizationId: string): Promise<ClientSiteEntity> {
    const site = await this.getSiteById(siteId, organizationId);
    
    // Unset all other main sites for this client
    const allSites = await this.siteRepository.findByClient(site.clientId);
    for (const s of allSites) {
      if (s.isMain && s.id !== siteId) {
        s.unsetAsMain();
        await this.siteRepository.update(s);
      }
    }

    site.setAsMain();
    return this.siteRepository.update(site);
  }

  async deleteSite(siteId: string, organizationId: string): Promise<void> {
    const site = await this.getSiteById(siteId, organizationId);
    await this.siteRepository.delete(siteId);
  }

  // Contact operations
  async createContact(
    clientId: string,
    organizationId: string,
    createDto: CreateClientContactDto,
  ): Promise<ClientContactEntity> {
    const client = await this.getClientById(clientId, organizationId);

    const contactCount = await this.contactRepository.countByClient(clientId);
    const isPrimary = contactCount === 0 && createDto.role === 'PRIMARY';

    const contact = ClientContactEntity.create({
      clientId,
      organizationId,
      firstName: createDto.firstName,
      lastName: createDto.lastName,
      role: createDto.role,
      email: createDto.email,
      phone: createDto.phone,
      mobilePhone: createDto.mobilePhone,
      position: createDto.position,
      department: createDto.department,
      isPrimary,
      notes: createDto.notes,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return this.contactRepository.save(contact);
  }

  async updateContact(
    contactId: string,
    updateDto: UpdateClientContactDto,
    organizationId: string,
  ): Promise<ClientContactEntity> {
    const contact = await this.contactRepository.findById(contactId);
    if (!contact || contact.organizationId !== organizationId) {
      throw new NotFoundException('Contact not found');
    }

    contact.update(updateDto);
    return this.contactRepository.update(contact);
  }

  async listClientContacts(clientId: string, organizationId: string): Promise<ClientContactEntity[]> {
    await this.getClientById(clientId, organizationId);
    return this.contactRepository.findByClient(clientId);
  }

  async deleteContact(contactId: string, organizationId: string): Promise<void> {
    const contact = await this.contactRepository.findById(contactId);
    if (!contact || contact.organizationId !== organizationId) {
      throw new NotFoundException('Contact not found');
    }
    await this.contactRepository.delete(contactId);
  }
}
