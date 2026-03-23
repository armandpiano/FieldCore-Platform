import { Entity } from '../../../shared/domain/base/entity';
import { WorkOrderStatus } from './work-order.entity';

export enum WorkOrderEventType {
  CREATED = 'created',
  UPDATED = 'updated',
  SUBMITTED = 'submitted',
  ASSIGNED = 'assigned',
  UNASSIGNED = 'unassigned',
  STARTED = 'started',
  PAUSED = 'paused',
  RESUMED = 'resumed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  COMMENT_ADDED = 'comment_added',
  EVIDENCE_ADDED = 'evidence_added',
  STATUS_CHANGED = 'status_changed',
}

export interface WorkOrderEventData {
  previousStatus?: WorkOrderStatus;
  newStatus?: WorkOrderStatus;
  previousValue?: string;
  newValue?: string;
  comment?: string;
  evidenceIds?: string[];
  metadata?: Record<string, any>;
}

export interface WorkOrderEventProps {
  workOrderId: string;
  organizationId: string;
  eventType: WorkOrderEventType;
  triggeredBy: string;
  triggeredByRole?: string;
  data: WorkOrderEventData;
  createdAt: Date;
}

export class WorkOrderEventEntity extends Entity<WorkOrderEventProps> {
  private constructor(props: WorkOrderEventProps, id?: string) {
    super(props, id);
  }

  static create(props: WorkOrderEventProps, id?: string): WorkOrderEventEntity {
    return new WorkOrderEventEntity(
      {
        ...props,
        createdAt: props.createdAt || new Date(),
      },
      id,
    );
  }

  static createEvent(
    workOrderId: string,
    organizationId: string,
    eventType: WorkOrderEventType,
    triggeredBy: string,
    triggeredByRole?: string,
    data: WorkOrderEventData = {},
  ): WorkOrderEventEntity {
    return WorkOrderEventEntity.create({
      workOrderId,
      organizationId,
      eventType,
      triggeredBy,
      triggeredByRole,
      data,
      createdAt: new Date(),
    });
  }

  static logStatusChange(
    workOrderId: string,
    organizationId: string,
    triggeredBy: string,
    previousStatus: WorkOrderStatus,
    newStatus: WorkOrderStatus,
    triggeredByRole?: string,
  ): WorkOrderEventEntity {
    return WorkOrderEventEntity.createEvent(
      workOrderId,
      organizationId,
      WorkOrderEventType.STATUS_CHANGED,
      triggeredBy,
      triggeredByRole,
      { previousStatus, newStatus },
    );
  }

  static logAssignment(
    workOrderId: string,
    organizationId: string,
    triggeredBy: string,
    technicianId: string,
    triggeredByRole?: string,
  ): WorkOrderEventEntity {
    return WorkOrderEventEntity.createEvent(
      workOrderId,
      organizationId,
      WorkOrderEventType.ASSIGNED,
      triggeredBy,
      triggeredByRole,
      { newValue: technicianId },
    );
  }

  static logCompletion(
    workOrderId: string,
    organizationId: string,
    triggeredBy: string,
    triggeredByRole?: string,
  ): WorkOrderEventEntity {
    return WorkOrderEventEntity.createEvent(
      workOrderId,
      organizationId,
      WorkOrderEventType.COMPLETED,
      triggeredBy,
      triggeredByRole,
    );
  }

  get workOrderId(): string {
    return this.props.workOrderId;
  }

  get organizationId(): string {
    return this.props.organizationId;
  }

  get eventType(): WorkOrderEventType {
    return this.props.eventType;
  }

  get triggeredBy(): string {
    return this.props.triggeredBy;
  }

  get triggeredByRole(): string | undefined {
    return this.props.triggeredByRole;
  }

  get data(): WorkOrderEventData {
    return this.props.data;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get previousStatus(): WorkOrderStatus | undefined {
    return this.props.data.previousStatus;
  }

  get newStatus(): WorkOrderStatus | undefined {
    return this.props.data.newStatus;
  }
}
