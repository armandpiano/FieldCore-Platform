import { WorkOrderEntity, WorkOrderStatus, WorkOrderPriority, WorkOrderType } from '../entities/work-order.entity';

export interface WorkOrderFilter {
  status?: WorkOrderStatus | WorkOrderStatus[];
  priority?: WorkOrderPriority;
  type?: WorkOrderType;
  clientId?: string;
  technicianId?: string;
  assignedToMe?: boolean;
  search?: string;
  dateFrom?: Date;
  dateTo?: Date;
  slaBreached?: boolean;
}

export interface WorkOrderRepositoryInterface {
  findById(id: string): Promise<WorkOrderEntity | null>;
  findByFolio(organizationId: string, folio: string): Promise<WorkOrderEntity | null>;
  findByOrganization(
    organizationId: string,
    filter?: WorkOrderFilter,
    page?: number,
    limit?: number,
  ): Promise<{ workOrders: WorkOrderEntity[]; total: number }>;
  findByTechnician(
    technicianId: string,
    filter?: WorkOrderFilter,
    page?: number,
    limit?: number,
  ): Promise<{ workOrders: WorkOrderEntity[]; total: number }>;
  findByClient(
    clientId: string,
    filter?: WorkOrderFilter,
    page?: number,
    limit?: number,
  ): Promise<{ workOrders: WorkOrderEntity[]; total: number }>;
  findOverdue(organizationId: string): Promise<WorkOrderEntity[]>;
  findByStatus(
    organizationId: string,
    status: WorkOrderStatus,
  ): Promise<WorkOrderEntity[]>;
  countByStatus(organizationId: string): Promise<Record<WorkOrderStatus, number>>;
  save(workOrder: WorkOrderEntity): Promise<WorkOrderEntity>;
  update(workOrder: WorkOrderEntity): Promise<WorkOrderEntity>;
  delete(id: string): Promise<void>;
}
