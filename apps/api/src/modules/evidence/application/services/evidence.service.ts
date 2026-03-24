import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { EvidenceEntity, EvidenceType } from '../../domain/entities/evidence.entity';
import { EvidenceRepositoryInterface, EvidenceFilter } from '../../domain/repositories/evidence.repository.interface';
import { StorageService } from './storage.service';
import { CreatePhotoDto, CreateSignatureDto, CreateCommentDto, EvidenceResponseDto, EvidenceListDto, EvidenceFilterDto } from '../dto/evidence.dto';
import { PaginatedResult } from '../../../shared/application/dto/pagination.dto';

@Injectable()
export class EvidenceService {
  constructor(
    private readonly evidenceRepository: EvidenceRepositoryInterface,
    private readonly storageService: StorageService,
  ) {}

  async uploadPhoto(
    organizationId: string,
    userId: string,
    workOrderId: string,
    file: {
      originalName: string;
      mimeType: string;
      size: number;
      buffer: Buffer;
    },
    metadata: {
      latitude?: number;
      longitude?: number;
      locationAddress?: string;
    },
  ): Promise<EvidenceEntity> {
    // Validate file
    this.validateImageFile(file.mimeType, file.size);

    // Upload to storage
    const uploadResult = await this.storageService.upload(
      organizationId,
      workOrderId,
      {
        originalName: file.originalName,
        mimeType: file.mimeType,
        size: file.size,
        buffer: file.buffer,
      },
      'photos',
    );

    // Create evidence record
    const evidence = EvidenceEntity.createPhoto(
      organizationId,
      workOrderId,
      userId,
      {
        fileName: uploadResult.fileName,
        originalName: file.originalName,
        mimeType: file.mimeType,
        fileSize: file.size,
        storagePath: uploadResult.storagePath,
        storageUrl: uploadResult.storageUrl,
        thumbnailUrl: uploadResult.thumbnailUrl,
        latitude: metadata.latitude,
        longitude: metadata.longitude,
        locationAddress: metadata.locationAddress,
      },
    );

    return this.evidenceRepository.save(evidence);
  }

  async uploadFile(
    organizationId: string,
    userId: string,
    workOrderId: string,
    file: {
      originalName: string;
      mimeType: string;
      size: number;
      buffer: Buffer;
    },
  ): Promise<EvidenceEntity> {
    // Validate file
    this.validateFileSize(file.size);

    // Upload to storage
    const uploadResult = await this.storageService.upload(
      organizationId,
      workOrderId,
      {
        originalName: file.originalName,
        mimeType: file.mimeType,
        size: file.size,
        buffer: file.buffer,
      },
      'files',
    );

    // Create evidence record
    const evidence = EvidenceEntity.createFile(
      organizationId,
      workOrderId,
      userId,
      {
        fileName: uploadResult.fileName,
        originalName: file.originalName,
        mimeType: file.mimeType,
        fileSize: file.size,
        storagePath: uploadResult.storagePath,
        storageUrl: uploadResult.storageUrl,
      },
    );

    return this.evidenceRepository.save(evidence);
  }

  async registerSignature(
    organizationId: string,
    userId: string,
    data: CreateSignatureDto,
  ): Promise<EvidenceEntity> {
    // Upload signature to storage
    const uploadResult = await this.storageService.uploadSignature(
      organizationId,
      data.workOrderId,
      data.signatureData,
    );

    // Create evidence record
    const evidence = EvidenceEntity.createSignature(
      organizationId,
      data.workOrderId,
      userId,
      {
        signerName: data.signerName,
        signerRole: data.signerRole,
        signatureData: data.signatureData,
        latitude: data.latitude,
        longitude: data.longitude,
      },
    );

    // Update with storage info
    evidence.props.storageUrl = uploadResult.storageUrl;
    evidence.props.storagePath = uploadResult.storagePath;

    return this.evidenceRepository.save(evidence);
  }

  async addComment(
    organizationId: string,
    userId: string,
    data: CreateCommentDto,
  ): Promise<EvidenceEntity> {
    const evidence = EvidenceEntity.createComment(
      organizationId,
      data.workOrderId,
      userId,
      data.comment,
      data.mentions,
    );

    return this.evidenceRepository.save(evidence);
  }

  async listWorkOrderEvidence(
    workOrderId: string,
    organizationId: string,
    filterDto?: EvidenceFilterDto,
    page: number = 1,
    limit: number = 50,
  ): Promise<PaginatedResult<EvidenceListDto>> {
    const filter: EvidenceFilter = {};
    
    if (filterDto?.type) {
      filter.type = filterDto.type as EvidenceType;
    }
    if (filterDto?.capturedBy) {
      filter.capturedBy = filterDto.capturedBy;
    }

    const { evidence, total } = await this.evidenceRepository.findByWorkOrder(
      workOrderId,
      filter,
      page,
      limit,
    );

    return {
      data: evidence.map(e => this.toListDto(e)),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getEvidenceById(id: string, organizationId: string): Promise<EvidenceEntity> {
    const evidence = await this.evidenceRepository.findById(id);
    if (!evidence || evidence.organizationId !== organizationId) {
      throw new NotFoundException('Evidence not found');
    }
    return evidence;
  }

  async getEvidenceDetail(id: string, organizationId: string): Promise<EvidenceResponseDto> {
    const evidence = await this.getEvidenceById(id, organizationId);
    return this.toResponseDto(evidence);
  }

  async deleteEvidence(id: string, organizationId: string): Promise<void> {
    const evidence = await this.getEvidenceById(id, organizationId);
    
    // Delete from storage
    if (evidence.storagePath) {
      await this.storageService.delete(evidence.storagePath);
    }

    // Soft delete - mark as inactive
    evidence.deactivate();
    await this.evidenceRepository.update(evidence);
  }

  async getWorkOrderEvidenceStats(workOrderId: string): Promise<{
    total: number;
    photos: number;
    files: number;
    signatures: number;
    comments: number;
    totalSize: number;
  }> {
    const photos = await this.evidenceRepository.countByWorkOrderAndType(workOrderId, EvidenceType.PHOTO);
    const files = await this.evidenceRepository.countByWorkOrderAndType(workOrderId, EvidenceType.FILE);
    const signatures = await this.evidenceRepository.countByWorkOrderAndType(workOrderId, EvidenceType.SIGNATURE);
    const comments = await this.evidenceRepository.countByWorkOrderAndType(workOrderId, EvidenceType.COMMENT);
    const total = photos + files + signatures + comments;

    return {
      total,
      photos,
      files,
      signatures,
      comments,
      totalSize: 0, // Would calculate from evidence records
    };
  }

  async getComments(workOrderId: string, page: number = 1, limit: number = 20): Promise<PaginatedResult<EvidenceListDto>> {
    const { evidence, total } = await this.evidenceRepository.findComments(workOrderId, page, limit);
    return {
      data: evidence.map(e => this.toListDto(e)),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getSignatures(workOrderId: string): Promise<EvidenceEntity[]> {
    return this.evidenceRepository.findSignatures(workOrderId);
  }

  private validateImageFile(mimeType: string, size: number): void {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(mimeType)) {
      throw new BadRequestException('Invalid image type. Allowed: JPEG, PNG, GIF, WebP');
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (size > maxSize) {
      throw new BadRequestException('Image size exceeds maximum allowed (10MB)');
    }
  }

  private validateFileSize(size: number): void {
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (size > maxSize) {
      throw new BadRequestException('File size exceeds maximum allowed (50MB)');
    }
  }

  private toResponseDto(evidence: EvidenceEntity): EvidenceResponseDto {
    return {
      id: evidence.id,
      organizationId: evidence.organizationId,
      workOrderId: evidence.workOrderId,
      type: evidence.type,
      fileName: evidence.fileName,
      originalName: evidence.originalName,
      fileType: evidence.fileType,
      mimeType: evidence.mimeType,
      fileSize: evidence.fileSize,
      formattedFileSize: evidence.formattedFileSize,
      storageUrl: evidence.storageUrl,
      thumbnailUrl: evidence.thumbnailUrl,
      signerName: evidence.signerName,
      signerRole: evidence.signerRole,
      signatureData: evidence.signatureData,
      comment: evidence.comment,
      latitude: evidence.latitude,
      longitude: evidence.longitude,
      locationAddress: evidence.locationAddress,
      capturedAt: evidence.capturedAt,
      capturedBy: evidence.capturedBy,
      isActive: evidence.isActive,
      createdAt: evidence.createdAt,
    };
  }

  private toListDto(evidence: EvidenceEntity): EvidenceListDto {
    return {
      id: evidence.id,
      workOrderId: evidence.workOrderId,
      type: evidence.type,
      fileName: evidence.fileName,
      originalName: evidence.originalName,
      fileType: evidence.fileType,
      mimeType: evidence.mimeType,
      fileSize: evidence.fileSize,
      formattedFileSize: evidence.formattedFileSize,
      thumbnailUrl: evidence.thumbnailUrl,
      signerName: evidence.signerName,
      comment: evidence.comment,
      capturedAt: evidence.capturedAt,
      createdAt: evidence.createdAt,
    };
  }
}
