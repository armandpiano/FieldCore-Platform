import { Injectable } from '@nestjs/common';
import { MembershipEntity, MembershipStatus } from '../../domain/entities/membership.entity';
import { UserRole } from '../../../identity/domain/entities/user.entity';
import { MembershipRepositoryInterface } from '../../domain/repositories/membership.repository.interface';
import { PrismaService } from '../../../../shared/infrastructure/database/prisma.service';
import { Membership } from '@prisma/client';

@Injectable()
export class PrismaMembershipRepository implements MembershipRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<MembershipEntity | null> {
    const membership = await this.prisma.membership.findUnique({ where: { id } });
    if (!membership) return null;
    return this.mapToEntity(membership);
  }

  async findByUserId(userId: string): Promise<MembershipEntity[]> {
    const memberships = await this.prisma.membership.findMany({
      where: { userId },
    });
    return memberships.map(m => this.mapToEntity(m));
  }

  async findByUserAndOrganization(userId: string, organizationId: string): Promise<MembershipEntity | null> {
    const membership = await this.prisma.membership.findFirst({
      where: { userId, organizationId },
    });
    if (!membership) return null;
    return this.mapToEntity(membership);
  }

  async findByOrganization(organizationId: string): Promise<MembershipEntity[]> {
    const memberships = await this.prisma.membership.findMany({
      where: { organizationId },
    });
    return memberships.map(m => this.mapToEntity(m));
  }

  async findByOrganizationPaginated(
    organizationId: string,
    page: number,
    limit: number,
  ): Promise<{ memberships: MembershipEntity[]; total: number }> {
    const [memberships, total] = await this.prisma.$transaction([
      this.prisma.membership.findMany({
        where: { organizationId },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.membership.count({ where: { organizationId } }),
    ]);
    return { memberships: memberships.map(m => this.mapToEntity(m)), total };
  }

  async findActiveByOrganization(organizationId: string): Promise<MembershipEntity[]> {
    const memberships = await this.prisma.membership.findMany({
      where: {
        organizationId,
        status: MembershipStatus.ACTIVE,
      },
    });
    return memberships.map(m => this.mapToEntity(m));
  }

  async countByOrganization(organizationId: string): Promise<number> {
    return this.prisma.membership.count({
      where: { organizationId, status: MembershipStatus.ACTIVE },
    });
  }

  async existsByUserAndOrganization(userId: string, organizationId: string): Promise<boolean> {
    const count = await this.prisma.membership.count({
      where: { userId, organizationId },
    });
    return count > 0;
  }

  async save(membership: MembershipEntity): Promise<MembershipEntity> {
    const data = {
      userId: membership.userId,
      organizationId: membership.organizationId,
      role: membership.role,
      status: membership.status,
      invitedBy: membership.props.invitedBy,
      invitedAt: membership.props.invitedAt,
      acceptedAt: membership.props.acceptedAt,
      suspendedAt: membership.props.suspendedAt,
      suspendedReason: membership.props.suspendedReason,
    };

    const saved = await this.prisma.membership.create({ data });
    return this.mapToEntity(saved);
  }

  async update(membership: MembershipEntity): Promise<MembershipEntity> {
    const data = {
      role: membership.role,
      status: membership.status,
      invitedAt: membership.props.invitedAt,
      acceptedAt: membership.props.acceptedAt,
      suspendedAt: membership.props.suspendedAt,
      suspendedReason: membership.props.suspendedReason,
      updatedAt: new Date(),
    };

    const updated = await this.prisma.membership.update({
      where: { id: membership.id },
      data,
    });
    return this.mapToEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.membership.delete({ where: { id } });
  }

  async deleteByUserAndOrganization(userId: string, organizationId: string): Promise<void> {
    await this.prisma.membership.deleteMany({
      where: { userId, organizationId },
    });
  }

  private mapToEntity(membership: Membership): MembershipEntity {
    return MembershipEntity.create(
      {
        userId: membership.userId,
        organizationId: membership.organizationId,
        role: membership.role as UserRole,
        status: membership.status as MembershipStatus,
        invitedBy: membership.invitedBy || undefined,
        invitedAt: membership.invitedAt || undefined,
        acceptedAt: membership.acceptedAt || undefined,
        suspendedAt: membership.suspendedAt || undefined,
        suspendedReason: membership.suspendedReason || undefined,
        createdAt: membership.createdAt,
        updatedAt: membership.updatedAt,
      },
      membership.id,
    );
  }
}
