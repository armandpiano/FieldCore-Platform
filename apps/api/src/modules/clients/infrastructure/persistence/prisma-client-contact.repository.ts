import { Injectable } from '@nestjs/common';
import { ClientContactEntity, ContactRole } from '../../domain/entities/client-contact.entity';
import { ContactRepositoryInterface } from '../../domain/repositories/client-contact.repository.interface';
import { PrismaService } from '../../../shared/infrastructure/database/prisma.service';
import { Prisma, ClientContact } from '@prisma/client';

@Injectable()
export class PrismaContactRepository implements ContactRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<ClientContactEntity | null> {
    const contact = await this.prisma.clientContact.findUnique({ where: { id } });
    if (!contact) return null;
    return this.mapToEntity(contact);
  }

  async findByClient(clientId: string): Promise<ClientContactEntity[]> {
    const contacts = await this.prisma.clientContact.findMany({
      where: { clientId },
      orderBy: [{ isPrimary: 'desc' }, { createdAt: 'asc' }],
    });
    return contacts.map(c => this.mapToEntity(c));
  }

  async findPrimaryContact(clientId: string): Promise<ClientContactEntity | null> {
    const contact = await this.prisma.clientContact.findFirst({
      where: { clientId, isPrimary: true },
    });
    if (!contact) return null;
    return this.mapToEntity(contact);
  }

  async findByRole(clientId: string, role: ContactRole): Promise<ClientContactEntity | null> {
    const contact = await this.prisma.clientContact.findFirst({
      where: { clientId, role },
    });
    if (!contact) return null;
    return this.mapToEntity(contact);
  }

  async countByClient(clientId: string): Promise<number> {
    return this.prisma.clientContact.count({ where: { clientId } });
  }

  async save(contact: ClientContactEntity): Promise<ClientContactEntity> {
    const saved = await this.prisma.clientContact.create({
      data: this.mapToPrisma(contact),
    });
    return this.mapToEntity(saved);
  }

  async update(contact: ClientContactEntity): Promise<ClientContactEntity> {
    const updated = await this.prisma.clientContact.update({
      where: { id: contact.id },
      data: {
        ...this.mapToPrisma(contact),
        updatedAt: new Date(),
      },
    });
    return this.mapToEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.clientContact.delete({ where: { id } });
  }

  async deleteByClient(clientId: string): Promise<void> {
    await this.prisma.clientContact.deleteMany({ where: { clientId } });
  }

  private mapToEntity(contact: ClientContact): ClientContactEntity {
    return ClientContactEntity.create(
      {
        clientId: contact.clientId,
        organizationId: contact.organizationId,
        firstName: contact.firstName,
        lastName: contact.lastName,
        role: contact.role as ContactRole,
        email: contact.email || undefined,
        phone: contact.phone || undefined,
        mobilePhone: contact.mobilePhone || undefined,
        position: contact.position || undefined,
        department: contact.department || undefined,
        isPrimary: contact.isPrimary,
        notes: contact.notes || undefined,
        createdAt: contact.createdAt,
        updatedAt: contact.updatedAt,
      },
      contact.id,
    );
  }

  private mapToPrisma(contact: ClientContactEntity): Prisma.ClientContactCreateInput {
    return {
      clientId: contact.clientId,
      organizationId: contact.organizationId,
      firstName: contact.props.firstName,
      lastName: contact.props.lastName,
      role: contact.props.role,
      email: contact.props.email,
      phone: contact.props.phone,
      mobilePhone: contact.props.mobilePhone,
      position: contact.props.position,
      department: contact.props.department,
      isPrimary: contact.props.isPrimary,
      notes: contact.props.notes,
    };
  }
}
