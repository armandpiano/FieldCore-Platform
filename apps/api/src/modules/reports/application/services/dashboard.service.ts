import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/infrastructure/database/prisma.service';
import { 
  DashboardOverview, 
  WorkOrderStatusCount, 
  WorkOrderPriorityCount,
  TechnicianPerformance,
  ClientMetrics,
  ProductivityTrend,
  SLAMetrics,
  DateRangeFilter 
} from '../../domain/dto/dashboard.dto';
import { WorkOrderStatus } from '../../../work-orders/domain/entities/work-order.entity';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getOverview(organizationId: string, filter?: DateRangeFilter): Promise<DashboardOverview> {
    const where = this.buildDateWhereClause(organizationId, filter);

    // Get status counts
    const statusCounts = await this.prisma.workOrder.groupBy({
      by: ['status'],
      where,
      _count: { status: true },
    });

    const byStatus: WorkOrderStatusCount = {
      draft: 0,
      pending_assignment: 0,
      assigned: 0,
      in_progress: 0,
      paused: 0,
      completed: 0,
      cancelled: 0,
    };

    statusCounts.forEach(sc => {
      byStatus[sc.status as keyof WorkOrderStatusCount] = sc._count.status;
    });

    // Get priority counts
    const priorityCounts = await this.prisma.workOrder.groupBy({
      by: ['priority'],
      where,
      _count: { priority: true },
    });

    const byPriority: WorkOrderPriorityCount = {
      low: 0,
      medium: 0,
      high: 0,
      urgent: 0,
    };

    priorityCounts.forEach(pc => {
      byPriority[pc.priority as keyof WorkOrderPriorityCount] = pc._count.priority;
    });

    // Get overdue count
    const overdueCount = await this.prisma.workOrder.count({
      where: {
        ...where,
        slaDeadline: { lt: new Date() },
        status: { notIn: [WorkOrderStatus.COMPLETED, WorkOrderStatus.CANCELLED] },
      },
    });

    // Get completed this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const completedThisMonth = await this.prisma.workOrder.count({
      where: {
        ...where,
        status: WorkOrderStatus.COMPLETED,
        completedAt: { gte: startOfMonth },
      },
    });

    // Calculate avg completion time
    const completedOrders = await this.prisma.workOrder.findMany({
      where: {
        ...where,
        status: WorkOrderStatus.COMPLETED,
        startedAt: { not: null },
        completedAt: { not: null },
      },
      select: { startedAt: true, completedAt: true, pausedDurationMinutes: true },
    });

    let avgCompletionTimeMinutes = 0;
    if (completedOrders.length > 0) {
      const totalMinutes = completedOrders.reduce((sum, wo) => {
        const duration = wo.completedAt!.getTime() - wo.startedAt!.getTime();
        const activeMinutes = Math.floor(duration / 60000) - (wo.pausedDurationMinutes || 0);
        return sum + activeMinutes;
      }, 0);
      avgCompletionTimeMinutes = Math.round(totalMinutes / completedOrders.length);
    }

    return {
      totalWorkOrders: Object.values(byStatus).reduce((a, b) => a + b, 0),
      byStatus,
      byPriority,
      overdueWorkOrders: overdueCount,
      completedThisMonth,
      avgCompletionTimeMinutes,
    };
  }

  async getTechnicianPerformance(
    organizationId: string,
    filter?: DateRangeFilter,
    limit: number = 10,
  ): Promise<TechnicianPerformance[]> {
    const where = this.buildDateWhereClause(organizationId, filter);

    // Get all technicians with their work orders
    const technicians = await this.prisma.membership.findMany({
      where: {
        organizationId,
        role: 'TECHNICIAN',
        status: 'ACTIVE',
      },
      include: {
        user: true,
      },
    });

    const performances: TechnicianPerformance[] = [];

    for (const tech of technicians) {
      const assigned = await this.prisma.workOrder.findMany({
        where: {
          ...where,
          assignedTechnicianId: tech.userId,
        },
      });

      const assignedCount = assigned.length;
      const completedCount = assigned.filter(wo => wo.status === WorkOrderStatus.COMPLETED).length;
      const inProgressCount = assigned.filter(wo => wo.status === WorkOrderStatus.IN_PROGRESS).length;

      // Calculate avg completion time
      const completedOrders = assigned.filter(
        wo => wo.status === WorkOrderStatus.COMPLETED && wo.startedAt && wo.completedAt
      );

      let avgTime = 0;
      if (completedOrders.length > 0) {
        const totalMinutes = completedOrders.reduce((sum, wo) => {
          const duration = wo.completedAt!.getTime() - wo.startedAt!.getTime();
          return sum + Math.floor(duration / 60000) - (wo.pausedDurationMinutes || 0);
        }, 0);
        avgTime = Math.round(totalMinutes / completedOrders.length);
      }

      // Productivity = completed / (total days in period * 8 hours)
      let productivity = 0;
      if (filter?.dateFrom && filter?.dateTo) {
        const days = Math.ceil(
          (filter.dateTo.getTime() - filter.dateFrom.getTime()) / (1000 * 60 * 60 * 24)
        );
        const workHours = days * 8;
        productivity = workHours > 0 ? Math.round((completedCount / workHours) * 100) / 100 : 0;
      } else {
        // Default: assume 30 day period
        productivity = Math.round((completedCount / 240) * 100) / 100;
      }

      performances.push({
        technicianId: tech.userId,
        technicianName: `${tech.user.firstName} ${tech.user.lastName}`,
        assignedCount,
        completedCount,
        inProgressCount,
        avgCompletionTimeMinutes: avgTime,
        productivity,
      });
    }

    // Sort by productivity
    return performances
      .sort((a, b) => b.productivity - a.productivity)
      .slice(0, limit);
  }

  async getProductivityTrend(
    organizationId: string,
    filter?: DateRangeFilter,
    groupBy: 'day' | 'week' | 'month' = 'day',
  ): Promise<ProductivityTrend[]> {
    const where = this.buildDateWhereClause(organizationId, filter);
    
    const dateFilter = filter?.dateFrom || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const endDate = filter?.dateTo || new Date();

    // Get all work orders in period
    const workOrders = await this.prisma.workOrder.findMany({
      where: {
        ...where,
        createdAt: { gte: dateFilter },
      },
      select: {
        createdAt: true,
        completedAt: true,
        status: true,
      },
    });

    // Group by period
    const trends: Map<string, ProductivityTrend> = new Map();

    // Initialize all periods
    const current = new Date(dateFilter);
    while (current <= endDate) {
      const key = this.getDateKey(current, groupBy);
      trends.set(key, { date: key, completed: 0, created: 0, inProgress: 0 });
      this.incrementPeriod(current, groupBy);
    }

    // Count created
    workOrders.forEach(wo => {
      const key = this.getDateKey(wo.createdAt, groupBy);
      const trend = trends.get(key);
      if (trend) trend.created++;
    });

    // Count completed
    workOrders
      .filter(wo => wo.completedAt)
      .forEach(wo => {
        const key = this.getDateKey(wo.completedAt!, groupBy);
        const trend = trends.get(key);
        if (trend) trend.completed++;
      });

    // Count in progress
    const inProgress = workOrders.filter(wo => wo.status === WorkOrderStatus.IN_PROGRESS);
    if (trends.size > 0) {
      const lastKey = Array.from(trends.keys()).pop();
      if (lastKey) {
        trends.get(lastKey)!.inProgress = inProgress.length;
      }
    }

    return Array.from(trends.values());
  }

  async getSLAMetrics(organizationId: string, filter?: DateRangeFilter): Promise<SLAMetrics> {
    const where = this.buildDateWhereClause(organizationId, filter);

    // Get orders with SLA
    const ordersWithSLA = await this.prisma.workOrder.findMany({
      where: {
        ...where,
        slaDeadline: { not: null },
      },
      select: {
        slaDeadline: true,
        slaBreached: true,
        completedAt: true,
        status: true,
      },
    });

    const breached = ordersWithSLA.filter(wo => wo.slaBreached).length;
    const total = ordersWithSLA.length;

    // Calculate breach hours
    const breachedOrders = ordersWithSLA.filter(wo => wo.slaBreached && wo.completedAt && wo.slaDeadline);
    let avgBreachHours = 0;
    if (breachedOrders.length > 0) {
      const totalBreachHours = breachedOrders.reduce((sum, wo) => {
        const breachTime = wo.completedAt!.getTime() - wo.slaDeadline!.getTime();
        return sum + breachTime / (1000 * 60 * 60);
      }, 0);
      avgBreachHours = Math.round((totalBreachHours / breachedOrders.length) * 10) / 10;
    }

    return {
      totalWithSLA: total,
      breached,
      complianceRate: total > 0 ? Math.round(((total - breached) / total) * 1000) / 10 : 100,
      avgBreachHours,
    };
  }

  async getClientMetrics(
    organizationId: string,
    filter?: DateRangeFilter,
    limit: number = 20,
  ): Promise<ClientMetrics[]> {
    const where = this.buildDateWhereClause(organizationId, filter);

    // Get all clients with work orders
    const clients = await this.prisma.client.findMany({
      where: { organizationId },
      select: {
        id: true,
        businessName: true,
        firstName: true,
        lastName: true,
        workOrders: {
          where: where,
          select: {
            status: true,
            completedAt: true,
            startedAt: true,
            pausedDurationMinutes: true,
          },
        },
      },
    });

    return clients
      .map(client => {
        const totalWorkOrders = client.workOrders.length;
        const completedWorkOrders = client.workOrders.filter(
          wo => wo.status === WorkOrderStatus.COMPLETED
        ).length;
        const pendingWorkOrders = client.workOrders.filter(
          wo => !['COMPLETED', 'CANCELLED'].includes(wo.status)
        ).length;

        let avgTime = 0;
        if (completedWorkOrders > 0) {
          const completed = client.workOrders.filter(
            wo => wo.status === WorkOrderStatus.COMPLETED && wo.startedAt && wo.completedAt
          );
          if (completed.length > 0) {
            const totalMinutes = completed.reduce((sum, wo) => {
              const duration = wo.completedAt!.getTime() - wo.startedAt!.getTime();
              return sum + Math.floor(duration / 60000) - (wo.pausedDurationMinutes || 0);
            }, 0);
            avgTime = Math.round(totalMinutes / completed.length);
          }
        }

        return {
          clientId: client.id,
          clientName: client.businessName || `${client.firstName} ${client.lastName}`,
          totalWorkOrders,
          completedWorkOrders,
          pendingWorkOrders,
          avgCompletionTimeMinutes: avgTime,
        };
      })
      .filter(c => c.totalWorkOrders > 0)
      .sort((a, b) => b.totalWorkOrders - a.totalWorkOrders)
      .slice(0, limit);
  }

  private buildDateWhereClause(organizationId: string, filter?: DateRangeFilter): any {
    const where: any = { organizationId };

    if (filter?.dateFrom) {
      where.createdAt = { gte: filter.dateFrom };
    }
    if (filter?.dateTo) {
      where.createdAt = { ...where.createdAt, lte: filter.dateTo };
    }

    return where;
  }

  private getDateKey(date: Date, groupBy: 'day' | 'week' | 'month'): string {
    const d = new Date(date);
    if (groupBy === 'day') {
      return d.toISOString().split('T')[0];
    } else if (groupBy === 'week') {
      const week = Math.ceil(d.getDate() / 7);
      return `${d.getFullYear()}-W${week}`;
    } else {
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    }
  }

  private incrementPeriod(date: Date, groupBy: 'day' | 'week' | 'month'): void {
    if (groupBy === 'day') {
      date.setDate(date.getDate() + 1);
    } else if (groupBy === 'week') {
      date.setDate(date.getDate() + 7);
    } else {
      date.setMonth(date.getMonth() + 1);
    }
  }
}
