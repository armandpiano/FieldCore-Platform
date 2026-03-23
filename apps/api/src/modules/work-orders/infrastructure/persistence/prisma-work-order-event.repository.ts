import { Injectable } from '@nestjs/common';
import { WorkOrderEventEntity, WorkOrderEventType } from '../../domain/entities/work-order-event.entity';
import { WorkOrderEventRepositoryInterface } from '../../domain/repositories/work-order-event.repository.interface';
import { PrismaService } from '../../../shared/infrastructure/database/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class PrismaWorkOrderEventRepository implements WorkOrderEventRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<WorkOrderEventEntity | null> {
    const event = await this.prisma.workOrderEvent.findUnique({ where: { id } });
    if (!event) return null;
    return this.mapToEntity(event);
  }

  async findByWorkOrder(workOrderId: string): Promise<WorkOrderEventEntity[]> {
    const events = await this.prisma.workOrderEvent.findMany({
      where: { workOrderId },
      orderBy: { createdAt: 'desc' },
    });
    return events.map(e => this.mapToEntity(e));
  }

  async findByWorkOrderPaginated(
    workOrderId: string,
    page: number = 1,
    limit: number = 50,
  ): Promise<{ events: WorkOrderEventEntity[]; total: number }> {
    const [events, total] = await this.prisma.$transaction([
      this.prisma.workOrderEvent.findMany({
        where: { workOrderId },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.workOrderEvent.count({ where: { workOrderId } }),
    ]);

    return { events: events.map(e => this.mapToEntity(e)), total };
  }

  async findByOrganization(
    organizationId: string,
    page: number = 1,
    limit: number = 50,
  ): Promise<{ events: WorkOrderEventEntity[]; total: number }> {
    const [events, total] = await this.prisma.$transaction([
      this.prisma.workOrderEvent.findMany({
        where: { organizationId },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.workOrderEvent.count({ where: { organizationId } }),
    ]);

    return { events: events.map(e => this.mapToEntity(e)), total };
  }

  async findByType(
    workOrderId: string,
    eventType: WorkOrderEventType,
  ): Promise<WorkOrderEventEntity[]> {
    const events = await this.prisma.workOrderEvent.findMany({
      where: { workOrderId, eventType },
      orderBy: { createdAt: 'desc' },
    });
    return events.map(e => this.mapToEntity(e));
  }

  async countByWorkOrder(workOrderId: string): Promise<number> {
    return this.prisma.workOrderEvent.count({ where: { workOrderId } });
  }

  async save(event: WorkOrderEventEntity): Promise<WorkOrderEventEntity> {
    const saved = await this.prisma.workOrderEvent.create({
      data: this.mapToPrisma(event),
    });
    return this.mapToEntity(saved);
  }

  async deleteByWorkOrder(workOrderId: string): Promise<void> {
    await this.prisma.workOrderEvent.deleteMany({ where: { workOrderId } });
  }

  private mapToEntity(event: any): WorkOrderEventEntity {
    return WorkOrderEventEntity.create({
      workOrderId: event.workOrderId,
      organizationId: event.organizationId,
      eventType: event.eventType as WorkOrderEventType,
      triggeredBy: event.triggeredBy,
      triggeredByRole: event.triggeredByRole || undefined,
      data: event.data || {},
      createdAt: event.createdAt,
    }, event.id);
  }

  private mapToPrisma(event: WorkOrderEventEntity): Prisma.WorkOrderEventCreateInput {
    return {
      workOrderId: event.workOrderId,
      organizationId: event.organizationId,
      eventType: event.eventType,
      triggeredBy: event.triggeredBy,
      triggeredByRole: event.triggeredByRole,
      data: event.data as any,
    };
  }
}
