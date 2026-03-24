import { EvidenceEntity, EvidenceType } from '../entities/evidence.entity';

export interface EvidenceFilter {
  type?: EvidenceType | EvidenceType[];
  workOrderId?: string;
  capturedBy?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface EvidenceRepositoryInterface {
  findById(id: string): Promise<EvidenceEntity | null>;
  findByWorkOrder(
    workOrderId: string,
    filter?: EvidenceFilter,
    page?: number,
    limit?: number,
  ): Promise<{ evidence: EvidenceEntity[]; total: number }>;
  findByOrganization(
    organizationId: string,
    filter?: EvidenceFilter,
    page?: number,
    limit?: number,
  ): Promise<{ evidence: EvidenceEntity[]; total: number }>;
  findByType(
    workOrderId: string,
    type: EvidenceType,
  ): Promise<EvidenceEntity[]>;
  findSignatures(workOrderId: string): Promise<EvidenceEntity[]>;
  findComments(
    workOrderId: string,
    page?: number,
    limit?: number,
  ): Promise<{ evidence: EvidenceEntity[]; total: number }>;
  countByWorkOrder(workOrderId: string): Promise<number>;
  countByWorkOrderAndType(workOrderId: string, type: EvidenceType): Promise<number>;
  getStorageUsedByOrganization(organizationId: string): Promise<number>;
  save(evidence: EvidenceEntity): Promise<EvidenceEntity>;
  update(evidence: EvidenceEntity): Promise<EvidenceEntity>;
  delete(id: string): Promise<void>;
  deleteByWorkOrder(workOrderId: string): Promise<void>;
}
