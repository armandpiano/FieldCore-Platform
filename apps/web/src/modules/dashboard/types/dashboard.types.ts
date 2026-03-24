// Dashboard Types for FieldCore

export interface KPICard {
  id: string;
  title: string;
  value: number | string;
  previousValue?: number;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  trend?: 'up' | 'down' | 'stable';
  format?: 'number' | 'percentage' | 'currency' | 'time';
  icon: string;
  color?: 'default' | 'blue' | 'green' | 'orange' | 'red' | 'purple' | 'yellow';
  link?: string;
}

export interface WorkOrderStatusCount {
  status: string;
  count: number;
  label: string;
  color: string;
}

export interface TechnicianStatus {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status: 'available' | 'busy' | 'offline' | 'on_route';
  activeOrders: number;
  completedToday: number;
  location?: {
    latitude: number;
    longitude: number;
    updatedAt: string;
  };
}

export interface OverdueOrder {
  id: string;
  folio: string;
  title: string;
  clientName: string;
  siteName: string;
  scheduledDate: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  slaDeadline: string;
  hoursOverdue: number;
  assignedTo?: {
    id: string;
    name: string;
  };
}

export interface RecentActivity {
  id: string;
  type: 'work_order_created' | 'work_order_assigned' | 'work_order_started' | 
        'work_order_completed' | 'evidence_uploaded' | 'comment_added' |
        'work_order_cancelled' | 'technician_status_changed';
  description: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  entityId?: string;
  entityType?: 'work_order' | 'technician' | 'client';
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface DashboardStats {
  kpis: KPICard[];
  workOrdersByStatus: WorkOrderStatusCount[];
  activeTechnicians: TechnicianStatus[];
  overdueOrders: OverdueOrder[];
  recentActivity: RecentActivity[];
  completionRate: number;
  averageResponseTime: number;
  satisfactionScore?: number;
}

export interface DashboardFilters {
  dateRange?: 'today' | 'week' | 'month' | 'quarter' | 'custom';
  dateFrom?: string;
  dateTo?: string;
  technicianId?: string;
  clientId?: string;
  priority?: string;
}

// Widget configurations
export interface WidgetConfig {
  id: string;
  type: 'kpi' | 'chart' | 'table' | 'list' | 'activity';
  title: string;
  size?: 'small' | 'medium' | 'large' | 'full';
  refreshInterval?: number; // seconds
  actions?: {
    label: string;
    href: string;
    icon?: string;
  }[];
}

// Chart data types
export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface TimeSeriesDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface PieChartData {
  label: string;
  value: number;
  color: string;
  percentage: number;
}

// Dashboard summary
export interface DashboardSummary {
  period: {
    start: string;
    end: string;
    label: string;
  };
  totalOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  pendingOrders: number;
  inProgressOrders: number;
  completionRate: number;
  averageDuration: number; // minutes
  totalRevenue?: number;
  ticketsResolved?: number;
}
