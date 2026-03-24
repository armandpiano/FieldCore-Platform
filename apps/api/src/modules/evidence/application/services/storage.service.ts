import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import * as crypto from 'crypto';

export interface StorageResult {
  fileName: string;
  storagePath: string;
  storageUrl: string;
  thumbnailUrl?: string;
}

export interface UploadedFile {
  originalName: string;
  mimeType: string;
  size: number;
  buffer: Buffer;
}

@Injectable()
export class StorageService {
  private readonly provider: 's3' | 'local';
  private readonly basePath: string;
  private readonly baseUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.provider = this.configService.get<'s3' | 'local'>('STORAGE_PROVIDER', 'local') as 's3' | 'local';
    this.basePath = this.configService.get<string>('STORAGE_PATH', './uploads');
    this.baseUrl = this.configService.get<string>('STORAGE_BASE_URL', '/uploads');
  }

  async upload(
    organizationId: string,
    workOrderId: string,
    file: UploadedFile,
    type: 'photos' | 'files' | 'signatures',
  ): Promise<StorageResult> {
    const fileName = this.generateFileName(file.originalName);
    const dateFolder = this.getDateFolder();
    const storagePath = `${organizationId}/${workOrderId}/${type}/${dateFolder}/${fileName}`;

    if (this.provider === 's3') {
      return this.uploadToS3(storagePath, file);
    }
    return this.uploadToLocal(storagePath, file);
  }

  async uploadSignature(
    organizationId: string,
    workOrderId: string,
    signatureData: string,
  ): Promise<StorageResult> {
    const fileName = `signature_${Date.now()}.png`;
    const storagePath = `${organizationId}/${workOrderId}/signatures/${fileName}`;

    const base64Data = signatureData.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    if (this.provider === 's3') {
      return this.uploadToS3Buffer(storagePath, buffer, 'image/png');
    }
    return this.uploadToLocalBuffer(storagePath, buffer, 'image/png');
  }

  async delete(storagePath: string): Promise<void> {
    if (this.provider === 's3') {
      // S3 deletion would be implemented here
    } else {
      const fullPath = path.join(this.basePath, storagePath);
      // In production, use fs.unlink
    }
  }

  getStorageUrl(storagePath: string): string {
    if (this.provider === 's3') {
      return `https://${this.configService.get('S3_BUCKET')}.s3.amazonaws.com/${storagePath}`;
    }
    return `${this.baseUrl}/${storagePath}`;
  }

  private generateFileName(originalName: string): string {
    const ext = path.extname(originalName);
    const hash = crypto.randomBytes(8).toString('hex');
    const timestamp = Date.now();
    return `${hash}_${timestamp}${ext}`;
  }

  private getDateFolder(): string {
    const now = new Date();
    return `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}`;
  }

  private async uploadToS3(storagePath: string, file: UploadedFile): Promise<StorageResult> {
    // In production, this would use AWS SDK
    // const s3 = new S3Client({...});
    // await s3.putObject({Bucket: bucket, Key: storagePath, Body: file.buffer});
    
    // For now, return mock result
    return {
      fileName: path.basename(storagePath),
      storagePath,
      storageUrl: `https://${this.configService.get('S3_BUCKET', 'fieldcore-evidence')}.s3.amazonaws.com/${storagePath}`,
    };
  }

  private async uploadToS3Buffer(storagePath: string, buffer: Buffer, mimeType: string): Promise<StorageResult> {
    return {
      fileName: path.basename(storagePath),
      storagePath,
      storageUrl: `https://${this.configService.get('S3_BUCKET', 'fieldcore-evidence')}.s3.amazonaws.com/${storagePath}`,
    };
  }

  private async uploadToLocal(storagePath: string, file: UploadedFile): Promise<StorageResult> {
    // In production, write to local filesystem
    return {
      fileName: path.basename(storagePath),
      storagePath,
      storageUrl: this.getStorageUrl(storagePath),
    };
  }

  private async uploadToLocalBuffer(storagePath: string, buffer: Buffer, mimeType: string): Promise<StorageResult> {
    return {
      fileName: path.basename(storagePath),
      storagePath,
      storageUrl: this.getStorageUrl(storagePath),
    };
  }
}
