import { Entity } from '../../../shared/domain/base/entity';

export enum EvidenceType {
  PHOTO = 'photo',
  FILE = 'file',
  SIGNATURE = 'signature',
  COMMENT = 'comment',
}

export enum FileType {
  IMAGE = 'image',
  VIDEO = 'video',
  DOCUMENT = 'document',
  PDF = 'pdf',
  OTHER = 'other',
}

export interface EvidenceProps {
  organizationId: string;
  workOrderId: string;
  type: EvidenceType;
  
  // File info
  fileName?: string;
  originalName?: string;
  fileType?: FileType;
  mimeType?: string;
  fileSize?: number;
  
  // Storage
  storageProvider?: 's3' | 'local' | 'azure';
  storagePath?: string;
  storageUrl?: string;
  thumbnailUrl?: string;
  
  // Signature specific
  signerName?: string;
  signerRole?: string;
  signatureData?: string;
  
  // Comment specific
  comment?: string;
  mentions?: string[];
  
  // Location
  latitude?: number;
  longitude?: number;
  locationAddress?: string;
  
  // Capture info
  capturedAt?: Date;
  capturedBy: string;
  
  // Status
  isActive: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}

export class EvidenceEntity extends Entity<EvidenceProps> {
  private constructor(props: EvidenceProps, id?: string) {
    super(props, id);
  }

  static create(props: EvidenceProps, id?: string): EvidenceEntity {
    return new EvidenceEntity(
      {
        ...props,
        isActive: props.isActive !== false,
        createdAt: props.createdAt || new Date(),
        updatedAt: props.updatedAt || new Date(),
      },
      id,
    );
  }

  static createPhoto(
    organizationId: string,
    workOrderId: string,
    capturedBy: string,
    data: {
      fileName: string;
      originalName: string;
      mimeType: string;
      fileSize: number;
      storagePath: string;
      storageUrl: string;
      thumbnailUrl?: string;
      latitude?: number;
      longitude?: number;
      locationAddress?: string;
    },
  ): EvidenceEntity {
    return EvidenceEntity.create({
      organizationId,
      workOrderId,
      type: EvidenceType.PHOTO,
      capturedBy,
      capturedAt: new Date(),
      fileName: data.fileName,
      originalName: data.originalName,
      mimeType: data.mimeType,
      fileType: FileType.IMAGE,
      fileSize: data.fileSize,
      storagePath: data.storagePath,
      storageUrl: data.storageUrl,
      thumbnailUrl: data.thumbnailUrl,
      latitude: data.latitude,
      longitude: data.longitude,
      locationAddress: data.locationAddress,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static createFile(
    organizationId: string,
    workOrderId: string,
    capturedBy: string,
    data: {
      fileName: string;
      originalName: string;
      mimeType: string;
      fileSize: number;
      storagePath: string;
      storageUrl: string;
    },
  ): EvidenceEntity {
    return EvidenceEntity.create({
      organizationId,
      workOrderId,
      type: EvidenceType.FILE,
      capturedBy,
      capturedAt: new Date(),
      fileName: data.fileName,
      originalName: data.originalName,
      mimeType: data.mimeType,
      fileType: this.determineFileType(data.mimeType),
      fileSize: data.fileSize,
      storagePath: data.storagePath,
      storageUrl: data.storageUrl,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static createSignature(
    organizationId: string,
    workOrderId: string,
    capturedBy: string,
    data: {
      signerName: string;
      signerRole?: string;
      signatureData: string;
      latitude?: number;
      longitude?: number;
    },
  ): EvidenceEntity {
    return EvidenceEntity.create({
      organizationId,
      workOrderId,
      type: EvidenceType.SIGNATURE,
      capturedBy,
      capturedAt: new Date(),
      signerName: data.signerName,
      signerRole: data.signerRole,
      signatureData: data.signatureData,
      latitude: data.latitude,
      longitude: data.longitude,
      fileName: `signature_${Date.now()}.png`,
      mimeType: 'image/png',
      fileType: FileType.IMAGE,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static createComment(
    organizationId: string,
    workOrderId: string,
    capturedBy: string,
    comment: string,
    mentions?: string[],
  ): EvidenceEntity {
    return EvidenceEntity.create({
      organizationId,
      workOrderId,
      type: EvidenceType.COMMENT,
      capturedBy,
      capturedAt: new Date(),
      comment,
      mentions,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  private static determineFileType(mimeType: string): FileType {
    if (mimeType.startsWith('image/')) return FileType.IMAGE;
    if (mimeType.startsWith('video/')) return FileType.VIDEO;
    if (mimeType === 'application/pdf') return FileType.PDF;
    if (mimeType.includes('document') || mimeType.includes('word')) return FileType.DOCUMENT;
    return FileType.OTHER;
  }

  // Getters
  get organizationId(): string { return this.props.organizationId; }
  get workOrderId(): string { return this.props.workOrderId; }
  get type(): EvidenceType { return this.props.type; }
  get fileName(): string | undefined { return this.props.fileName; }
  get originalName(): string | undefined { return this.props.originalName; }
  get fileType(): FileType | undefined { return this.props.fileType; }
  get mimeType(): string | undefined { return this.props.mimeType; }
  get fileSize(): number | undefined { return this.props.fileSize; }
  get storageUrl(): string | undefined { return this.props.storageUrl; }
  get thumbnailUrl(): string | undefined { return this.props.thumbnailUrl; }
  get signerName(): string | undefined { return this.props.signerName; }
  get signerRole(): string | undefined { return this.props.signerRole; }
  get signatureData(): string | undefined { return this.props.signatureData; }
  get comment(): string | undefined { return this.props.comment; }
  get latitude(): number | undefined { return this.props.latitude; }
  get longitude(): number | undefined { return this.props.longitude; }
  get locationAddress(): string | undefined { return this.props.locationAddress; }
  get capturedAt(): Date | undefined { return this.props.capturedAt; }
  get capturedBy(): string { return this.props.capturedBy; }
  get isActive(): boolean { return this.props.isActive; }
  get createdAt(): Date { return this.props.createdAt; }

  get hasLocation(): boolean {
    return this.props.latitude !== undefined && this.props.longitude !== undefined;
  }

  get isPhoto(): boolean { return this.props.type === EvidenceType.PHOTO; }
  get isFile(): boolean { return this.props.type === EvidenceType.FILE; }
  get isSignature(): boolean { return this.props.type === EvidenceType.SIGNATURE; }
  get isComment(): boolean { return this.props.type === EvidenceType.COMMENT; }

  get formattedFileSize(): string {
    if (!this.props.fileSize) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = this.props.fileSize;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  }

  deactivate(): void {
    this.props.isActive = false;
    this.touch();
  }

  activate(): void {
    this.props.isActive = true;
    this.touch();
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }
}
