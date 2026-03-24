import { WorkOrderStatus, WorkOrderPriority } from '../../../work-orders/domain/entities/work-order.entity';

export interface DateRangeFilter {
  dateFrom?: Date;
  dateTo?: Date;
}

export interface DashboardOverview {
  totalWorkOrders: number;
  byStatus: WorkOrderStatusCount;
  byPriority: WorkOrderPriorityCount;
  overdueWorkOrders: number;
  completedThisMonth: number;
  avgCompletionTimeMinutes: number;
}

export interface WorkOrderStatusCount {
  draft: number;
  pending_assignment: number;
  assigned: number;
  in_progress: number;
  paused: number;
  completed: number;
  cancelled: number;
}

export interface WorkOrderPriorityCount {
  low: number;
  medium: number;
  high: number;
  urgent: number;
}

export interface TechnicianPerformance {
  technicianId: string;
  technicianName: string;
  assignedCount: number;
  completedCount: number;
  inProgressCount: number;
  avgCompletionTimeMinutes: number;
  productivity: number;
}

export interface ClientMetrics {
  clientId: string;
  clientName: string;
  totalWorkOrders: number;
  completedWorkOrders: number;
  pendingWorkOrders: number;
  avgCompletionTimeMinutes: number;
}

export interface ProductivityTrend {
  date: string;
  completed: number;
  created: number;
  inProgress: number;
}

export interface SLAMetrics {
  totalWithSLA: number;
  breached: number;
  complianceRate: number;
  avgBreachHours: number;
}

export interface WorkOrderTimelineStats {
  avgTimeToAssign: number;
  avgTimeToStart: number;
  avgTimeToComplete: number;
  avgActiveTimeMinutes: number;
}
