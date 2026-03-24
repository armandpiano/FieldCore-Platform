import { IsString, IsOptional, IsNumber, IsEnum, MaxLength, IsArray, Min, Max } from 'class-validator';
import { EvidenceType, FileType } from '../../domain/entities/evidence.entity';

export class CreatePhotoDto {
  @IsString()
  @IsNotEmpty()
  workOrderId!: string;

  @IsNumber()
  @IsOptional()
  @Min(-90)
  @Max(90)
  latitude?: number;

  @IsNumber()
  @IsOptional()
  @Min(-180)
  @Max(180)
  longitude?: number;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  locationAddress?: string;
}

export class CreateFileDto {
  @IsString()
  @IsNotEmpty()
  workOrderId!: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  description?: string;
}

export class CreateSignatureDto {
  @IsString()
  @IsNotEmpty()
  workOrderId!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  signerName!: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  signerRole?: string;

  @IsString()
  @IsNotEmpty()
  signatureData!: string;

  @IsNumber()
  @IsOptional()
  @Min(-90)
  @Max(90)
  latitude?: number;

  @IsNumber()
  @IsOptional()
  @Min(-180)
  @Max(180)
  longitude?: number;
}

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  workOrderId!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  comment!: string;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  mentions?: string[];
}

export class EvidenceResponseDto {
  id!: string;
  organizationId!: string;
  workOrderId!: string;
  type!: string;
  fileName?: string;
  originalName?: string;
  fileType?: string;
  mimeType?: string;
  fileSize?: number;
  formattedFileSize!: string;
  storageUrl?: string;
  thumbnailUrl?: string;
  signerName?: string;
  signerRole?: string;
  signatureData?: string;
  comment?: string;
  latitude?: number;
  longitude?: number;
  locationAddress?: string;
  capturedAt?: Date;
  capturedBy!: string;
  isActive!: boolean;
  createdAt!: Date;
}

export class EvidenceListDto {
  id!: string;
  workOrderId!: string;
  type!: string;
  fileName?: string;
  originalName?: string;
  fileType?: string;
  mimeType?: string;
  fileSize?: number;
  formattedFileSize!: string;
  thumbnailUrl?: string;
  signerName?: string;
  comment?: string;
  capturedAt?: Date;
  createdAt!: Date;
}

export class EvidenceFilterDto {
  @IsString()
  @IsOptional()
  type?: string;

  @IsString()
  @IsOptional()
  workOrderId?: string;

  @IsString()
  @IsOptional()
  capturedBy?: string;
}

export class EvidenceUploadResponseDto {
  id!: string;
  fileName!: string;
  storageUrl!: string;
  thumbnailUrl?: string;
  mimeType!: string;
  fileSize!: number;
}
