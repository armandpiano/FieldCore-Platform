import { WorkOrderEventType, WorkOrderEventData } from '../../domain/entities/work-order-event.entity';

export class WorkOrderEventDto {
  id!: string;
  workOrderId!: string;
  eventType!: string;
  triggeredBy!: string;
  triggeredByRole?: string;
  data!: WorkOrderEventData;
  createdAt!: Date;
}

export class WorkOrderTimelineDto {
  events!: WorkOrderEventDto[];
  total!: number;
  page!: number;
  limit!: number;
}
