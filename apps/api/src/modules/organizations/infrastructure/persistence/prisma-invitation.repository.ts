import { Injectable } from '@nestjs/common';
import { InvitationEntity, InvitationStatus } from '../../domain/entities/invitation.entity';
import { UserRole } from '../../../identity/domain/entities/user.entity';
import { InvitationRepositoryInterface } from '../../domain/repositories/invitation.repository.interface';
import { PrismaService } from '../../../../shared/infrastructure/database/prisma.service';
import { Invitation } from '@prisma/client';

@Injectable()
export class PrismaInvitationRepository implements InvitationRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<InvitationEntity | null> {
    const invitation = await this.prisma.invitation.findUnique({ where: { id } });
    if (!invitation) return null;
    return this.mapToEntity(invitation);
  }

  async findByToken(token: string): Promise<InvitationEntity | null> {
    const invitation = await this.prisma.invitation.findUnique({ where: { token } });
    if (!invitation) return null;
    return this.mapToEntity(invitation);
  }

  async findByEmail(email: string): Promise<InvitationEntity[]> {
    const invitations = await this.prisma.invitation.findMany({
      where: { email: email.toLowerCase() },
    });
    return invitations.map(i => this.mapToEntity(i));
  }

  async findByOrganization(organizationId: string): Promise<InvitationEntity[]> {
    const invitations = await this.prisma.invitation.findMany({
      where: { organizationId },
    });
    return invitations.map(i => this.mapToEntity(i));
  }

  async findPendingByOrganization(organizationId: string): Promise<InvitationEntity[]> {
    const invitations = await this.prisma.invitation.findMany({
      where: {
        organizationId,
        status: InvitationStatus.PENDING,
        expiresAt: { gt: new Date() },
      },
    });
    return invitations.map(i => this.mapToEntity(i));
  }

  async findPendingByEmail(email: string): Promise<InvitationEntity[]> {
    const invitations = await this.prisma.invitation.findMany({
      where: {
        email: email.toLowerCase(),
        status: InvitationStatus.PENDING,
        expiresAt: { gt: new Date() },
      },
    });
    return invitations.map(i => this.mapToEntity(i));
  }

  async save(invitation: InvitationEntity): Promise<InvitationEntity> {
    const data = {
      email: invitation.email,
      organizationId: invitation.organizationId,
      organizationName: invitation.organizationName,
      role: invitation.role,
      status: invitation.status,
      invitedBy: invitation.props.invitedBy,
      token: invitation.token,
      expiresAt: invitation.expiresAt,
      acceptedAt: invitation.props.acceptedAt,
      cancelledAt: invitation.props.cancelledAt,
    };

    const saved = await this.prisma.invitation.create({ data });
    return this.mapToEntity(saved);
  }

  async update(invitation: InvitationEntity): Promise<InvitationEntity> {
    const data = {
      status: invitation.status,
      acceptedAt: invitation.props.acceptedAt,
      cancelledAt: invitation.props.cancelledAt,
      updatedAt: new Date(),
    };

    const updated = await this.prisma.invitation.update({
      where: { id: invitation.id },
      data,
    });
    return this.mapToEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.invitation.delete({ where: { id } });
  }

  async deleteExpired(): Promise<number> {
    const result = await this.prisma.invitation.deleteMany({
      where: {
        OR: [
          { status: InvitationStatus.EXPIRED },
          { status: InvitationStatus.ACCEPTED },
          { status: InvitationStatus.CANCELLED },
          { expiresAt: { lt: new Date() } },
        ],
      },
    });
    return result.count;
  }

  private mapToEntity(invitation: Invitation): InvitationEntity {
    return InvitationEntity.create(
      invitation.email,
      invitation.organizationId,
      invitation.organizationName,
      invitation.role as UserRole,
      invitation.invitedBy,
      invitation.token,
      7,
    );
  }
}
