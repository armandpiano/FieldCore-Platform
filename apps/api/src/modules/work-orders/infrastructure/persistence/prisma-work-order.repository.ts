import { Injectable } from '@nestjs/common';
import { WorkOrderEntity, WorkOrderStatus, WorkOrderPriority, WorkOrderType } from '../../domain/entities/work-order.entity';
import { WorkOrderRepositoryInterface, WorkOrderFilter } from '../../domain/repositories/work-order.repository.interface';
import { PrismaService } from '../../../shared/infrastructure/database/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class PrismaWorkOrderRepository implements WorkOrderRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<WorkOrderEntity | null> {
    const wo = await this.prisma.workOrder.findUnique({ where: { id } });
    if (!wo) return null;
    return this.mapToEntity(wo);
  }

  async findByFolio(organizationId: string, folio: string): Promise<WorkOrderEntity | null> {
    const wo = await this.prisma.workOrder.findFirst({
      where: { organizationId, folio },
    });
    if (!wo) return null;
    return this.mapToEntity(wo);
  }

  async findByOrganization(
    organizationId: string,
    filter?: WorkOrderFilter,
    page: number = 1,
    limit: number = 20,
  ): Promise<{ workOrders: WorkOrderEntity[]; total: number }> {
    const where: Prisma.WorkOrderWhereInput = { organizationId };

    if (filter?.status) {
      where.status = filter.status as WorkOrderStatus;
    }
    if (filter?.priority) {
      where.priority = filter.priority;
    }
    if (filter?.type) {
      where.type = filter.type;
    }
    if (filter?.clientId) {
      where.clientId = filter.clientId;
    }
    if (filter?.technicianId) {
      where.assignedTechnicianId = filter.technicianId;
    }
    if (filter?.search) {
      where.OR = [
        { folio: { contains: filter.search, mode: 'insensitive' } },
        { title: { contains: filter.search, mode: 'insensitive' } },
        { description: { contains: filter.search, mode: 'insensitive' } },
      ];
    }
    if (filter?.slaBreached !== undefined) {
      where.slaBreached = filter.slaBreached;
    }

    const [workOrders, total] = await this.prisma.$transaction([
      this.prisma.workOrder.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: [
          { priority: 'desc' },
          { slaDeadline: 'asc' },
          { createdAt: 'desc' },
        ],
      }),
      this.prisma.workOrder.count({ where }),
    ]);

    return { workOrders: workOrders.map(w => this.mapToEntity(w)), total };
  }

  async findByTechnician(
    technicianId: string,
    filter?: WorkOrderFilter,
    page: number = 1,
    limit: number = 20,
  ): Promise<{ workOrders: WorkOrderEntity[]; total: number }> {
    const where: Prisma.WorkOrderWhereInput = { assignedTechnicianId: technicianId };

    if (filter?.status) {
      where.status = filter.status as WorkOrderStatus;
    }
    if (filter?.priority) {
      where.priority = filter.priority;
    }

    const [workOrders, total] = await this.prisma.$transaction([
      this.prisma.workOrder.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: [
          { priority: 'desc' },
          { schedule: { scheduledDate: 'asc' } },
        ],
      }),
      this.prisma.workOrder.count({ where }),
    ]);

    return { workOrders: workOrders.map(w => this.mapToEntity(w)), total };
  }

  async findByClient(
    clientId: string,
    filter?: WorkOrderFilter,
    page: number = 1,
    limit: number = 20,
  ): Promise<{ workOrders: WorkOrderEntity[]; total: number }> {
    const where: Prisma.WorkOrderWhereInput = { clientId };

    if (filter?.status) {
      where.status = filter.status as WorkOrderStatus;
    }

    const [workOrders, total] = await this.prisma.$transaction([
      this.prisma.workOrder.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.workOrder.count({ where }),
    ]);

    return { workOrders: workOrders.map(w => this.mapToEntity(w)), total };
  }

  async findOverdue(organizationId: string): Promise<WorkOrderEntity[]> {
    const now = new Date();
    const workOrders = await this.prisma.workOrder.findMany({
      where: {
        organizationId,
        slaDeadline: { lt: now },
        status: { notIn: [WorkOrderStatus.COMPLETED, WorkOrderStatus.CANCELLED] },
        slaBreached: false,
      },
    });
    return workOrders.map(w => this.mapToEntity(w));
  }

  async findByStatus(organizationId: string, status: WorkOrderStatus): Promise<WorkOrderEntity[]> {
    const workOrders = await this.prisma.workOrder.findMany({
      where: { organizationId, status },
    });
    return workOrders.map(w => this.mapToEntity(w));
  }

  async countByStatus(organizationId: string): Promise<Record<WorkOrderStatus, number>> {
    const counts = await this.prisma.workOrder.groupBy({
      by: ['status'],
      where: { organizationId },
      _count: { status: true },
    });

    const result: Record<string, number> = {};
    for (const status of Object.values(WorkOrderStatus)) {
      result[status] = 0;
    }
    counts.forEach(c => {
      result[c.status] = c._count.status;
    });
    return result as Record<WorkOrderStatus, number>;
  }

  async save(workOrder: WorkOrderEntity): Promise<WorkOrderEntity> {
    const saved = await this.prisma.workOrder.create({
      data: this.mapToPrisma(workOrder),
    });
    return this.mapToEntity(saved);
  }

  async update(workOrder: WorkOrderEntity): Promise<WorkOrderEntity> {
    const updated = await this.prisma.workOrder.update({
      where: { id: workOrder.id },
      data: {
        ...this.mapToPrisma(workOrder),
        updatedAt: new Date(),
      },
    });
    return this.mapToEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.workOrder.delete({ where: { id } });
  }

  private mapToEntity(wo: any): WorkOrderEntity {
    return WorkOrderEntity.create({
      organizationId: wo.organizationId,
      clientId: wo.clientId,
      clientSiteId: wo.clientSiteId || undefined,
      folio: wo.folio,
      title: wo.title,
      description: wo.description,
      type: wo.type as WorkOrderType,
      priority: wo.priority as WorkOrderPriority,
      status: wo.status as WorkOrderStatus,
      assignedTechnicianId: wo.assignedTechnicianId || undefined,
      assignedAt: wo.assignedAt || undefined,
      assignedBy: wo.assignedBy || undefined,
      schedule: wo.schedule || {},
      location: wo.location || {},
      estimatedCost: wo.estimatedCost || undefined,
      actualCost: wo.actualCost || undefined,
      startedAt: wo.startedAt || undefined,
      pausedAt: wo.pausedAt || undefined,
      pausedDurationMinutes: wo.pausedDurationMinutes || 0,
      completedAt: wo.completedAt || undefined,
      cancelledAt: wo.cancelledAt || undefined,
      cancelledBy: wo.cancelledBy || undefined,
      cancellationReason: wo.cancellationReason || undefined,
      slaDeadline: wo.slaDeadline || undefined,
      slaBreached: wo.slaBreached || false,
      createdBy: wo.createdBy,
      createdAt: wo.createdAt,
      updatedAt: wo.updatedAt,
    }, wo.id);
  }

  private mapToPrisma(wo: WorkOrderEntity): Prisma.WorkOrderCreateInput {
    return {
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
      schedule: wo.schedule as any,
      location: wo.location as any,
      estimatedCost: wo.props.estimatedCost,
      actualCost: wo.props.actualCost,
      startedAt: wo.props.startedAt,
      pausedAt: wo.props.pausedAt,
      pausedDurationMinutes: wo.props.pausedDurationMinutes,
      completedAt: wo.props.completedAt,
      cancelledAt: wo.props.cancelledAt,
      cancelledBy: wo.props.cancelledBy,
      cancellationReason: wo.props.cancellationReason,
      slaDeadline: wo.props.slaDeadline,
      slaBreached: wo.props.slaBreached,
      createdBy: wo.props.createdBy,
    };
  }
}
