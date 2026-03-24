import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboard.service';
import { DashboardFilters } from '../types/dashboard.types';

// Query keys
export const dashboardKeys = {
  all: ['dashboard'] as const,
  stats: (filters?: DashboardFilters) => [...dashboardKeys.all, 'stats', filters] as const,
  kpis: (filters?: DashboardFilters) => [...dashboardKeys.all, 'kpis', filters] as const,
  workOrdersByStatus: (filters?: DashboardFilters) => [...dashboardKeys.all, 'status', filters] as const,
  activeTechnicians: () => [...dashboardKeys.all, 'technicians'] as const,
  overdueOrders: (limit?: number) => [...dashboardKeys.all, 'overdue', limit] as const,
  recentActivity: (limit?: number) => [...dashboardKeys.all, 'activity', limit] as const,
  summary: (filters?: DashboardFilters) => [...dashboardKeys.all, 'summary', filters] as const,
};

// Hook: Get dashboard stats
export function useDashboardStats(filters?: DashboardFilters) {
  return useQuery({
    queryKey: dashboardKeys.stats(filters),
    queryFn: () => dashboardService.getStats(filters),
    staleTime: 60000, // 1 minute
    refetchOnWindowFocus: true,
  });
}

// Hook: Get KPIs
export function useKPIs(filters?: DashboardFilters) {
  return useQuery({
    queryKey: dashboardKeys.kpis(filters),
    queryFn: () => dashboardService.getKPIs(filters),
    staleTime: 60000,
  });
}

// Hook: Get work orders by status
export function useWorkOrdersByStatus(filters?: DashboardFilters) {
  return useQuery({
    queryKey: dashboardKeys.workOrdersByStatus(filters),
    queryFn: () => dashboardService.getWorkOrdersByStatus(filters),
    staleTime: 60000,
  });
}

// Hook: Get active technicians
export function useActiveTechnicians() {
  return useQuery({
    queryKey: dashboardKeys.activeTechnicians(),
    queryFn: () => dashboardService.getActiveTechnicians(),
    staleTime: 30000, // 30 seconds - more frequent updates
    refetchInterval: 60000, // Poll every minute
  });
}

// Hook: Get overdue orders
export function useOverdueOrders(limit = 5) {
  return useQuery({
    queryKey: dashboardKeys.overdueOrders(limit),
    queryFn: () => dashboardService.getOverdueOrders(limit),
    staleTime: 60000,
  });
}

// Hook: Get recent activity
export function useRecentActivity(limit = 10) {
  return useQuery({
    queryKey: dashboardKeys.recentActivity(limit),
    queryFn: () => dashboardService.getRecentActivity(limit),
    staleTime: 30000,
    refetchInterval: 60000,
  });
}

// Hook: Get summary
export function useDashboardSummary(filters?: DashboardFilters) {
  return useQuery({
    queryKey: dashboardKeys.summary(filters),
    queryFn: () => dashboardService.getSummary(filters),
    staleTime: 60000,
  });
}

// Combined hook for dashboard data
export function useDashboard(filters?: DashboardFilters) {
  const stats = useDashboardStats(filters);
  const workOrdersByStatus = useWorkOrdersByStatus(filters);
  const activeTechnicians = useActiveTechnicians();
  const overdueOrders = useOverdueOrders(5);
  const recentActivity = useRecentActivity(10);
  const summary = useDashboardSummary(filters);

  const isLoading = 
    stats.isLoading || 
    workOrdersByStatus.isLoading || 
    activeTechnicians.isLoading || 
    overdueOrders.isLoading || 
    recentActivity.isLoading ||
    summary.isLoading;

  const isError = 
    stats.isError || 
    workOrdersByStatus.isError || 
    activeTechnicians.isError || 
    overdueOrders.isError || 
    recentActivity.isError ||
    summary.isError;

  const refetchAll = () => {
    stats.refetch();
    workOrdersByStatus.refetch();
    activeTechnicians.refetch();
    overdueOrders.refetch();
    recentActivity.refetch();
    summary.refetch();
  };

  return {
    stats: stats.data,
    workOrdersByStatus: workOrdersByStatus.data,
    activeTechnicians: activeTechnicians.data,
    overdueOrders: overdueOrders.data,
    recentActivity: recentActivity.data,
    summary: summary.data,
    isLoading,
    isError,
    refetch: refetchAll,
  };
}
