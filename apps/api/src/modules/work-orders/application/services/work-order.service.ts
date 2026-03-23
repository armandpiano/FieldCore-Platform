import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { WorkOrderEntity, WorkOrderStatus, WorkOrderPriority, WorkOrderType, WorkOrderSchedule, WorkOrderLocation } from '../../domain/entities/work-order.entity';
import { WorkOrderEventEntity, WorkOrderEventType } from '../../domain/entities/work-order-event.entity';
import { WorkOrderRepositoryInterface } from '../../domain/repositories/work-order.repository.interface';
import { WorkOrderEventRepositoryInterface } from '../../domain/repositories/work-order-event.repository.interface';
import { CreateWorkOrderDto, UpdateWorkOrderDto, WorkOrderFilterDto, WorkOrderListItemDto, WorkOrderResponseDto, WorkOrderDetailDto } from '../dto/work-order.dto';
import { WorkOrderEventDto, WorkOrderTimelineDto } from '../dto/work-order-event.dto';
import { PaginatedResult } from '../../../shared/application/dto/pagination.dto';

@Injectable()
export class WorkOrderService {
  constructor(
    private readonly workOrderRepository: WorkOrderRepositoryInterface,
    private readonly eventRepository: WorkOrderEventRepositoryInterface,
  ) {}

  async createWorkOrder(
    organizationId: string,
    createDto: CreateWorkOrderDto,
    createdBy: string,
    createdByRole: string,
  ): Promise<WorkOrderEntity> {
    const workOrder = WorkOrderEntity.create({
      organizationId,
      clientId: createDto.clientId,
      clientSiteId: createDto.clientSiteId,
      title: createDto.title,
      description: createDto.description,
      type: createDto.type,
      priority: createDto.priority || WorkOrderPriority.MEDIUM,
      status: WorkOrderStatus.DRAFT,
      createdBy,
      schedule: createDto.schedule || {},
      location: createDto.location || {},
      estimatedCost: createDto.estimatedCost,
      slaDeadline: createDto.slaDeadline ? new Date(createDto.slaDeadline) : undefined,
      slaBreached: false,
      pausedDurationMinutes: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const savedWorkOrder = await this.workOrderRepository.save(workOrder);

    // Log creation event
    const event = WorkOrderEventEntity.createEvent(
      savedWorkOrder.id,
      organizationId,
      WorkOrderEventType.CREATED,
      createdBy,
      createdByRole,
    );
    await this.eventRepository.save(event);

    return savedWorkOrder;
  }

  async updateWorkOrder(
    id: string,
    updateDto: UpdateWorkOrderDto,
    userId: string,
    organizationId: string,
  ): Promise<WorkOrderEntity> {
    const workOrder = await this.getWorkOrderById(id, organizationId);

    if (!workOrder.canBeModified()) {
      throw new BadRequestException('Work order cannot be modified in current status');
    }

    if (updateDto.title) workOrder.props.title = updateDto.title;
    if (updateDto.description) workOrder.props.description = updateDto.description;
    if (updateDto.type) workOrder.props.type = updateDto.type;
    if (updateDto.priority) workOrder.props.priority = updateDto.priority;
    if (updateDto.estimatedCost !== undefined) workOrder.props.estimatedCost = updateDto.estimatedCost;
    if (updateDto.slaDeadline) workOrder.props.slaDeadline = new Date(updateDto.slaDeadline);
    if (updateDto.schedule) workOrder.updateSchedule(updateDto.schedule);
    if (updateDto.location) workOrder.updateLocation(updateDto.location);

    const updated = await this.workOrderRepository.update(workOrder);

    // Log update event
    const event = WorkOrderEventEntity.createEvent(
      id,
      organizationId,
      WorkOrderEventType.UPDATED,
      userId,
    );
    await this.eventRepository.save(event);

    return updated;
  }

  async submitWorkOrder(
    id: string,
    userId: string,
    organizationId: string,
  ): Promise<WorkOrderEntity> {
    const workOrder = await this.getWorkOrderById(id, organizationId);
    workOrder.submit();
    const updated = await this.workOrderRepository.update(workOrder);
    await this.logStatusChange(updated, userId, undefined, WorkOrderStatus.PENDING_ASSIGNMENT);
    return updated;
  }

  async assignTechnician(
    id: string,
    technicianId: string,
    userId: string,
    userRole: string,
    organizationId: string,
  ): Promise<WorkOrderEntity> {
    const workOrder = await this.getWorkOrderById(id, organizationId);

    const previousStatus = workOrder.status;
    workOrder.assign(technicianId, userId);

    const updated = await this.workOrderRepository.update(workOrder);

    // Log assignment event
    const event = WorkOrderEventEntity.logAssignment(id, organizationId, userId, technicianId, userRole);
    await this.eventRepository.save(event);
    await this.logStatusChange(updated, userId, previousStatus, WorkOrderStatus.ASSIGNED);

    return updated;
  }

  async unassignTechnician(
    id: string,
    userId: string,
    organizationId: string,
  ): Promise<WorkOrderEntity> {
    const workOrder = await this.getWorkOrderById(id, organizationId);
    workOrder.unassign();
    const updated = await this.workOrderRepository.update(workOrder);
    await this.logStatusChange(updated, userId, WorkOrderStatus.ASSIGNED, WorkOrderStatus.PENDING_ASSIGNMENT);
    return updated;
  }

  async startWorkOrder(
    id: string,
    userId: string,
    organizationId: string,
  ): Promise<WorkOrderEntity> {
    const workOrder = await this.getWorkOrderById(id, organizationId);
    const previousStatus = workOrder.status;
    workOrder.start();
    const updated = await this.workOrderRepository.update(workOrder);
    await this.logStatusChange(updated, userId, previousStatus, WorkOrderStatus.IN_PROGRESS);
    return updated;
  }

  async pauseWorkOrder(
    id: string,
    userId: string,
    organizationId: string,
  ): Promise<WorkOrderEntity> {
    const workOrder = await this.getWorkOrderById(id, organizationId);
    const previousStatus = workOrder.status;
    workOrder.pause();
    const updated = await this.workOrderRepository.update(workOrder);
    await this.logStatusChange(updated, userId, previousStatus, WorkOrderStatus.PAUSED);
    return updated;
  }

  async resumeWorkOrder(
    id: string,
    userId: string,
    organizationId: string,
  ): Promise<WorkOrderEntity> {
    const workOrder = await this.getWorkOrderById(id, organizationId);
    const previousStatus = workOrder.status;
    workOrder.resume();
    const updated = await this.workOrderRepository.update(workOrder);
    await this.logStatusChange(updated, userId, previousStatus, WorkOrderStatus.IN_PROGRESS);
    return updated;
  }

  async completeWorkOrder(
    id: string,
    userId: string,
    userRole: string,
    actualCost?: number,
    organizationId?: string,
  ): Promise<WorkOrderEntity> {
    const workOrder = await this.getWorkOrderById(id, organizationId!);
    const previousStatus = workOrder.status;
    workOrder.complete(actualCost);
    const updated = await this.workOrderRepository.update(workOrder);

    // Log completion event
    const event = WorkOrderEventEntity.logCompletion(id, organizationId!, userId, userRole);
    await this.eventRepository.save(event);
    await this.logStatusChange(updated, userId, previousStatus, WorkOrderStatus.COMPLETED);

    return updated;
  }

  async cancelWorkOrder(
    id: string,
    reason: string,
    userId: string,
    organizationId: string,
  ): Promise<WorkOrderEntity> {
    const workOrder = await this.getWorkOrderById(id, organizationId);
    const previousStatus = workOrder.status;
    workOrder.cancel(userId, reason);
    const updated = await this.workOrderRepository.update(workOrder);
    await this.logStatusChange(updated, userId, previousStatus, WorkOrderStatus.CANCELLED);
    return updated;
  }

  async getWorkOrderById(id: string, organizationId: string): Promise<WorkOrderEntity> {
    const workOrder = await this.workOrderRepository.findById(id);
    if (!workOrder || workOrder.organizationId !== organizationId) {
      throw new NotFoundException('Work order not found');
    }
    return workOrder;
  }

  async getWorkOrderDetail(
    id: string,
    organizationId: string,
  ): Promise<WorkOrderDetailDto> {
    const workOrder = await this.getWorkOrderById(id, organizationId);
    const events = await this.eventRepository.findByWorkOrder(id);
    
    return {
      ...this.toResponse(workOrder),
      events: events.map(e => this.eventToDto(e)),
    };
  }

  async listWorkOrders(
    organizationId: string,
    filterDto: WorkOrderFilterDto,
    page: number = 1,
    limit: number = 20,
  ): Promise<PaginatedResult<WorkOrderListItemDto>> {
    const filter: any = {};
    
    if (filterDto.status) {
      filter.status = filterDto.status as WorkOrderStatus;
    }
    if (filterDto.priority) {
      filter.priority = filterDto.priority;
    }
    if (filterDto.type) {
      filter.type = filterDto.type;
    }
    if (filterDto.clientId) {
      filter.clientId = filterDto.clientId;
    }
    if (filterDto.technicianId) {
      filter.technicianId = filterDto.technicianId;
    }
    if (filterDto.search) {
      filter.search = filterDto.search;
    }
    if (filterDto.dateFrom) {
      filter.dateFrom = new Date(filterDto.dateFrom);
    }
    if (filterDto.dateTo) {
      filter.dateTo = new Date(filterDto.dateTo);
    }

    const { workOrders, total } = await this.workOrderRepository.findByOrganization(
      organizationId,
      filter,
      page,
      limit,
    );

    return {
      data: workOrders.map(wo => this.toListItem(wo)),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async listMyWorkOrders(
    technicianId: string,
    organizationId: string,
    filterDto: WorkOrderFilterDto,
    page: number = 1,
    limit: number = 20,
  ): Promise<PaginatedResult<WorkOrderListItemDto>> {
    const { workOrders, total } = await this.workOrderRepository.findByTechnician(
      technicianId,
      { ...filterDto, technicianId },
      page,
      limit,
    );

    return {
      data: workOrders.map(wo => this.toListItem(wo)),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getWorkOrderTimeline(
    workOrderId: string,
    organizationId: string,
    page: number = 1,
    limit: number = 50,
  ): Promise<WorkOrderTimelineDto> {
    const workOrder = await this.getWorkOrderById(workOrderId, organizationId);
    const { events, total } = await this.eventRepository.findByWorkOrderPaginated(
      workOrderId,
      page,
      limit,
    );

    return {
      events: events.map(e => this.eventToDto(e)),
      total,
      page,
      limit,
    };
  }

  async getWorkOrderStats(organizationId: string): Promise<{
    total: number;
    byStatus: Record<WorkOrderStatus, number>;
    overdue: number;
    completedThisMonth: number;
  }> {
    const byStatus = await this.workOrderRepository.countByStatus(organizationId);
    const total = Object.values(byStatus).reduce((a, b) => a + b, 0);
    const overdue = (await this.workOrderRepository.findOverdue(organizationId)).length;

    return {
      total,
      byStatus,
      overdue,
      completedThisMonth: byStatus[WorkOrderStatus.COMPLETED] || 0,
    };
  }

  private async logStatusChange(
    workOrder: WorkOrderEntity,
    userId: string,
    previousStatus?: WorkOrderStatus,
    newStatus?: WorkOrderStatus,
  ): Promise<void> {
    const event = WorkOrderEventEntity.logStatusChange(
      workOrder.id,
      workOrder.organizationId,
      userId,
      previousStatus || workOrder.status,
      newStatus || workOrder.status,
    );
    await this.eventRepository.save(event);
  }

  private toResponse(wo: WorkOrderEntity): WorkOrderResponseDto {
    return {
      id: wo.id,
      organizationId: wo.organizationId,
      clientId: wo.clientId,
      clientSiteId: wo.clientSiteId,
      folio: wo.folio,
      title: wo.title,
      description: wo.description,
      type: wo.type,
      priority: wo.priority,
      status: wo.status,
      assignedTechnicianId: wo.assignedTechnicianId,
      assignedAt: wo.assignedAt,
      assignedBy: wo.assignedBy,
      schedule: wo.schedule,
      location: wo.location,
      estimatedCost: wo.props.estimatedCost,
      actualCost: wo.props.actualCost,
      startedAt: wo.startedAt,
      pausedAt: wo.props.pausedAt,
      pausedDurationMinutes: wo.props.pausedDurationMinutes || 0,
      completedAt: wo.completedAt,
      cancelledAt: wo.props.cancelledAt,
      cancelledBy: wo.props.cancelledBy,
      cancellationReason: wo.props.cancellationReason,
      slaDeadline: wo.slaDeadline,
      slaBreached: wo.isSlaBreached,
      createdBy: wo.props.createdBy,
      createdAt: wo.props.createdAt,
      updatedAt: wo.props.updatedAt,
    };
  }

  private toListItem(wo: WorkOrderEntity): WorkOrderListItemDto {
    return {
      id: wo.id,
      folio: wo.folio,
      title: wo.title,
      type: wo.type,
      priority: wo.priority,
      status: wo.status,
      clientId: wo.clientId,
      assignedTechnicianId: wo.assignedTechnicianId,
      scheduledDate: wo.schedule.scheduledDate,
      slaDeadline: wo.slaDeadline,
      slaBreached: wo.isSlaBreached,
      createdAt: wo.props.createdAt,
    };
  }

  private eventToDto(event: WorkOrderEventEntity): WorkOrderEventDto {
    return {
      id: event.id,
      workOrderId: event.workOrderId,
      eventType: event.eventType,
      triggeredBy: event.triggeredBy,
      triggeredByRole: event.triggeredByRole,
      data: event.data,
      createdAt: event.createdAt,
    };
  }
}
