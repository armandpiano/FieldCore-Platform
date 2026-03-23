import { Injectable } from '@nestjs/common';
import { UserEntity } from '../../domain/entities/user.entity';
import { Email } from '../../domain/value-objects/email.value-object';
import { Password } from '../../domain/value-objects/password.value-object';
import { UserRepositoryInterface } from '../../domain/repositories/user.repository.interface';
import { PrismaService } from '../../../shared/infrastructure/database/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class PrismaUserRepository implements UserRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) return null;
    return this.mapToEntity(user);
  }

  async findByEmail(email: Email): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: { email: email.value },
    });
    if (!user) return null;
    return this.mapToEntity(user);
  }

  async findByOrganization(organizationId: string): Promise<UserEntity[]> {
    const users = await this.prisma.user.findMany({
      where: { organizationId },
    });
    return users.map((u) => this.mapToEntity(u));
  }

  async findByOrganizationPaginated(
    organizationId: string,
    page: number,
    limit: number,
  ): Promise<{ users: UserEntity[]; total: number }> {
    const [users, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where: { organizationId },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where: { organizationId } }),
    ]);

    return {
      users: users.map((u) => this.mapToEntity(u)),
      total,
    };
  }

  async existsByEmail(email: Email, organizationId: string): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: { email: email.value, organizationId },
    });
    return count > 0;
  }

  async save(user: UserEntity): Promise<UserEntity> {
    const data = {
      email: user.email.value,
      password: user.password.hash,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      organizationId: user.organizationId,
      isActive: user.isActive,
      lastLoginAt: user.lastLoginAt,
    };

    const saved = await this.prisma.user.create({ data });
    return this.mapToEntity(saved);
  }

  async update(user: UserEntity): Promise<UserEntity> {
    const data = {
      email: user.email.value,
      password: user.password.hash,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isActive: user.isActive,
      lastLoginAt: user.lastLoginAt,
      updatedAt: new Date(),
    };

    const updated = await this.prisma.user.update({
      where: { id: user.id },
      data,
    });
    return this.mapToEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }

  private mapToEntity(user: User): UserEntity {
    return UserEntity.create(
      {
        email: Email.create(user.email),
        password: Password.fromHash(user.password),
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role as any,
        organizationId: user.organizationId,
        isActive: user.isActive,
        lastLoginAt: user.lastLoginAt || undefined,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      user.id,
    );
  }
}
