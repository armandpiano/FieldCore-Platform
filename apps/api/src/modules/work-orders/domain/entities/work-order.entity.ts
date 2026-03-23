/**
 * WorkOrderEntity - Domain Entity
 * Represents a work order in the system
 */

import { Entity, EntityId } from '../../../../shared/domain/base/entity';
import { BusinessRuleException, InvalidStateException } from '../../../../shared/domain/exceptions/domain.exception';

export type WorkOrderStatusEnum = 'PENDING' | 'ASSIGNED' | 'IN_PROGRESS' | 'PAUSED' | 'COMPLETED' | 'CANCELLED';
export type WorkOrderPriorityEnum = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface WorkOrderProps {
  organizationId: string;
  folio: string;
  title: string;
  description?: string;
  clientId: string;
  clientSiteId?: string;
  technicianId?: string;
  status: WorkOrderStatusEnum;
  priority: WorkOrderPriorityEnum;
  scheduledDate: Date;
  slaDeadline: Date;
  createdById: string;
  estimatedDuration?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class WorkOrderEntity extends Entity<EntityId> {
  private _props: WorkOrderProps;

  constructor(id: EntityId, props: WorkOrderProps) {
    super(id);
    this._props = { ...props };
  }

  // Getters
  get organizationId(): string { return this._props.organizationId; }
  get folio(): string { return this._props.folio; }
  get title(): string { return this._props.title; }
  get status(): WorkOrderStatusEnum { return this._props.status; }
  get priority(): WorkOrderPriorityEnum { return this._props.priority; }
  get technicianId(): string | undefined { return this._props.technicianId; }
  get scheduledDate(): Date { return this._props.scheduledDate; }
  get slaDeadline(): Date { return this._props.slaDeadline; }

  // Domain Methods
  assign(technicianId: string): void {
    if (this._props.status !== 'PENDING') {
      throw new InvalidStateException('Cannot assign: order is not in PENDING status', this._props.status);
    }
    this._props.technicianId = technicianId;
    this._props.status = 'ASSIGNED';
    this._props.updatedAt = new Date();
  }

  start(): void {
    if (this._props.status !== 'ASSIGNED') {
      throw new InvalidStateException('Cannot start: order must be in ASSIGNED status', this._props.status);
    }
    this._props.status = 'IN_PROGRESS';
    this._props.updatedAt = new Date();
  }

  pause(): void {
    if (this._props.status !== 'IN_PROGRESS') {
      throw new InvalidStateException('Cannot pause: order is not in progress', this._props.status);
    }
    this._props.status = 'PAUSED';
    this._props.updatedAt = new Date();
  }

  resume(): void {
    if (this._props.status !== 'PAUSED') {
      throw new InvalidStateException('Cannot resume: order is not paused', this._props.status);
    }
    this._props.status = 'IN_PROGRESS';
    this._props.updatedAt = new Date();
  }

  complete(): void {
    if (!['IN_PROGRESS', 'PAUSED'].includes(this._props.status)) {
      throw new InvalidStateException('Cannot complete: order must be in progress or paused', this._props.status);
    }
    this._props.status = 'COMPLETED';
    this._props.updatedAt = new Date();
  }

  cancel(): void {
    if (['COMPLETED', 'CANCELLED'].includes(this._props.status)) {
      throw new InvalidStateException('Cannot cancel: order is already completed or cancelled', this._props.status);
    }
    this._props.status = 'CANCELLED';
    this._props.updatedAt = new Date();
  }

  toPlainObject(): Record<string, any> {
    return {
      id: this._id,
      ...this._props,
    };
  }
}
