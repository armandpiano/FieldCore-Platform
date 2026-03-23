import { Injectable } from '@nestjs/common';
import { SessionEntity } from '../../domain/entities/session.entity';
import { SessionRepositoryInterface } from '../../domain/repositories/session.repository.interface';
import { PrismaService } from '../../../shared/infrastructure/database/prisma.service';
import { Session } from '@prisma/client';

@Injectable()
export class PrismaSessionRepository implements SessionRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<SessionEntity | null> {
    const session = await this.prisma.session.findUnique({ where: { id } });
    if (!session) return null;
    return this.mapToEntity(session);
  }

  async findByRefreshToken(token: string): Promise<SessionEntity | null> {
    const session = await this.prisma.session.findUnique({
      where: { refreshToken: token },
    });
    if (!session) return null;
    return this.mapToEntity(session);
  }

  async findByUserId(userId: string): Promise<SessionEntity[]> {
    const sessions = await this.prisma.session.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return sessions.map((s) => this.mapToEntity(s));
  }

  async findActiveByUserId(userId: string): Promise<SessionEntity[]> {
    const now = new Date();
    const sessions = await this.prisma.session.findMany({
      where: {
        userId,
        isRevoked: false,
        expiresAt: { gt: now },
      },
      orderBy: { createdAt: 'desc' },
    });
    return sessions.map((s) => this.mapToEntity(s));
  }

  async save(session: SessionEntity): Promise<SessionEntity> {
    const data = {
      userId: session.userId,
      organizationId: session.organizationId,
      refreshToken: session.refreshToken,
      userAgent: session.userAgent,
      ipAddress: session.ipAddress,
      expiresAt: session.expiresAt,
      createdAt: session.createdAt,
      isRevoked: session.isRevoked,
      revokedAt: session.revokedAt,
    };

    const saved = await this.prisma.session.create({ data });
    return this.mapToEntity(saved);
  }

  async update(session: SessionEntity): Promise<SessionEntity> {
    const data = {
      refreshToken: session.refreshToken,
      expiresAt: session.expiresAt,
      isRevoked: session.isRevoked,
      revokedAt: session.revokedAt,
    };

    const updated = await this.prisma.session.update({
      where: { id: session.id },
      data,
    });
    return this.mapToEntity(updated);
  }

  async revoke(id: string): Promise<void> {
    await this.prisma.session.update({
      where: { id },
      data: { isRevoked: true, revokedAt: new Date() },
    });
  }

  async revokeAllForUser(userId: string): Promise<void> {
    await this.prisma.session.updateMany({
      where: { userId, isRevoked: false },
      data: { isRevoked: true, revokedAt: new Date() },
    });
  }

  async revokeAllForOrganization(organizationId: string): Promise<void> {
    await this.prisma.session.updateMany({
      where: { organizationId, isRevoked: false },
      data: { isRevoked: true, revokedAt: new Date() },
    });
  }

  async deleteExpired(): Promise<number> {
    const result = await this.prisma.session.deleteMany({
      where: {
        OR: [{ isRevoked: true }, { expiresAt: { lt: new Date() } }],
      },
    });
    return result.count;
  }

  private mapToEntity(session: Session): SessionEntity {
    return SessionEntity.create(
      {
        userId: session.userId,
        organizationId: session.organizationId,
        refreshToken: session.refreshToken,
        userAgent: session.userAgent || undefined,
        ipAddress: session.ipAddress || undefined,
        expiresAt: session.expiresAt,
        createdAt: session.createdAt,
        isRevoked: session.isRevoked,
        revokedAt: session.revokedAt || undefined,
      },
      session.id,
    );
  }
}
