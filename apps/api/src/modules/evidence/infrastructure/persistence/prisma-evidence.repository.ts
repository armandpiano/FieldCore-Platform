import { Injectable } from '@nestjs/common';
import { EvidenceEntity, EvidenceType, FileType } from '../../domain/entities/evidence.entity';
import { EvidenceRepositoryInterface, EvidenceFilter } from '../../domain/repositories/evidence.repository.interface';
import { PrismaService } from '../../../shared/infrastructure/database/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class PrismaEvidenceRepository implements EvidenceRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<EvidenceEntity | null> {
    const evidence = await this.prisma.evidence.findUnique({ where: { id } });
    if (!evidence) return null;
    return this.mapToEntity(evidence);
  }

  async findByWorkOrder(
    workOrderId: string,
    filter?: EvidenceFilter,
    page: number = 1,
    limit: number = 50,
  ): Promise<{ evidence: EvidenceEntity[]; total: number }> {
    const where: Prisma.EvidenceWhereInput = {
      workOrderId,
      isActive: true,
    };

    if (filter?.type) {
      where.type = filter.type as EvidenceType;
    }
    if (filter?.capturedBy) {
      where.capturedBy = filter.capturedBy;
    }

    const [evidence, total] = await this.prisma.$transaction([
      this.prisma.evidence.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.evidence.count({ where }),
    ]);

    return { evidence: evidence.map(e => this.mapToEntity(e)), total };
  }

  async findByOrganization(
    organizationId: string,
    filter?: EvidenceFilter,
    page: number = 1,
    limit: number = 50,
  ): Promise<{ evidence: EvidenceEntity[]; total: number }> {
    const where: Prisma.EvidenceWhereInput = {
      organizationId,
      isActive: true,
    };

    if (filter?.type) {
      where.type = filter.type as EvidenceType;
    }

    const [evidence, total] = await this.prisma.$transaction([
      this.prisma.evidence.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.evidence.count({ where }),
    ]);

    return { evidence: evidence.map(e => this.mapToEntity(e)), total };
  }

  async findByType(
    workOrderId: string,
    type: EvidenceType,
  ): Promise<EvidenceEntity[]> {
    const evidence = await this.prisma.evidence.findMany({
      where: { workOrderId, type, isActive: true },
      orderBy: { createdAt: 'desc' },
    });
    return evidence.map(e => this.mapToEntity(e));
  }

  async findSignatures(workOrderId: string): Promise<EvidenceEntity[]> {
    return this.findByType(workOrderId, EvidenceType.SIGNATURE);
  }

  async findComments(
    workOrderId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<{ evidence: EvidenceEntity[]; total: number }> {
    return this.findByWorkOrder(
      workOrderId,
      { type: EvidenceType.COMMENT },
      page,
      limit,
    );
  }

  async countByWorkOrder(workOrderId: string): Promise<number> {
    return this.prisma.evidence.count({
      where: { workOrderId, isActive: true },
    });
  }

  async countByWorkOrderAndType(workOrderId: string, type: EvidenceType): Promise<number> {
    return this.prisma.evidence.count({
      where: { workOrderId, type, isActive: true },
    });
  }

  async getStorageUsedByOrganization(organizationId: string): Promise<number> {
    const result = await this.prisma.evidence.aggregate({
      where: { organizationId, isActive: true, fileSize: { not: null } },
      _sum: { fileSize: true },
    });
    return result._sum.fileSize || 0;
  }

  async save(evidence: EvidenceEntity): Promise<EvidenceEntity> {
    const saved = await this.prisma.evidence.create({
      data: this.mapToPrisma(evidence),
    });
    return this.mapToEntity(saved);
  }

  async update(evidence: EvidenceEntity): Promise<EvidenceEntity> {
    const updated = await this.prisma.evidence.update({
      where: { id: evidence.id },
      data: {
        ...this.mapToPrisma(evidence),
        updatedAt: new Date(),
      },
    });
    return this.mapToEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.evidence.delete({ where: { id } });
  }

  async deleteByWorkOrder(workOrderId: string): Promise<void> {
    await this.prisma.evidence.deleteMany({ where: { workOrderId } });
  }

  private mapToEntity(evidence: any): EvidenceEntity {
    return EvidenceEntity.create({
      organizationId: evidence.organizationId,
      workOrderId: evidence.workOrderId,
      type: evidence.type as EvidenceType,
      fileName: evidence.fileName || undefined,
      originalName: evidence.originalName || undefined,
      fileType: evidence.fileType as FileType || undefined,
      mimeType: evidence.mimeType || undefined,
      fileSize: evidence.fileSize || undefined,
      storageProvider: evidence.storageProvider || undefined,
      storagePath: evidence.storagePath || undefined,
      storageUrl: evidence.storageUrl || undefined,
      thumbnailUrl: evidence.thumbnailUrl || undefined,
      signerName: evidence.signerName || undefined,
      signerRole: evidence.signerRole || undefined,
      signatureData: evidence.signatureData || undefined,
      comment: evidence.comment || undefined,
      mentions: evidence.mentions || undefined,
      latitude: evidence.latitude || undefined,
      longitude: evidence.longitude || undefined,
      locationAddress: evidence.locationAddress || undefined,
      capturedAt: evidence.capturedAt || undefined,
      capturedBy: evidence.capturedBy,
      isActive: evidence.isActive,
      createdAt: evidence.createdAt,
      updatedAt: evidence.updatedAt,
    }, evidence.id);
  }

  private mapToPrisma(evidence: EvidenceEntity): Prisma.EvidenceCreateInput {
    return {
      organizationId: evidence.organizationId,
      workOrderId: evidence.workOrderId,
      type: evidence.type,
      fileName: evidence.fileName,
      originalName: evidence.originalName,
      fileType: evidence.fileType,
      mimeType: evidence.mimeType,
      fileSize: evidence.fileSize,
      storageProvider: evidence.props.storageProvider,
      storagePath: evidence.storagePath,
      storageUrl: evidence.storageUrl,
      thumbnailUrl: evidence.thumbnailUrl,
      signerName: evidence.signerName,
      signerRole: evidence.signerRole,
      signatureData: evidence.signatureData,
      comment: evidence.comment,
      mentions: evidence.props.mentions,
      latitude: evidence.latitude,
      longitude: evidence.longitude,
      locationAddress: evidence.locationAddress,
      capturedAt: evidence.capturedAt,
      capturedBy: evidence.capturedBy,
      isActive: evidence.isActive,
    };
  }
}
