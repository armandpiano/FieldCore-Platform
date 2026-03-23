import { WorkOrderEventEntity, WorkOrderEventType } from '../entities/work-order-event.entity';

export interface WorkOrderEventRepositoryInterface {
  findById(id: string): Promise<WorkOrderEventEntity | null>;
  findByWorkOrder(workOrderId: string): Promise<WorkOrderEventEntity[]>;
  findByWorkOrderPaginated(
    workOrderId: string,
    page: number,
    limit: number,
  ): Promise<{ events: WorkOrderEventEntity[]; total: number }>;
  findByOrganization(
    organizationId: string,
    page?: number,
    limit?: number,
  ): Promise<{ events: WorkOrderEventEntity[]; total: number }>;
  findByType(
    workOrderId: string,
    eventType: WorkOrderEventType,
  ): Promise<WorkOrderEventEntity[]>;
  countByWorkOrder(workOrderId: string): Promise<number>;
  save(event: WorkOrderEventEntity): Promise<WorkOrderEventEntity>;
  deleteByWorkOrder(workOrderId: string): Promise<void>;
}
