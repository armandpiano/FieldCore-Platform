import { apiClient } from '@/lib/api-client';
import {
  DashboardStats,
  DashboardFilters,
  DashboardSummary,
  KPICard,
  WorkOrderStatusCount,
  TechnicianStatus,
  OverdueOrder,
  RecentActivity,
} from '../types/dashboard.types';

const BASE_URL = '/api/v1/dashboard';

export const dashboardService = {
  // Get main dashboard stats
  async getStats(filters?: DashboardFilters): Promise<DashboardStats> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.set(key, String(value));
        }
      });
    }
    
    const response = await apiClient.get(`${BASE_URL}/stats?${params.toString()}`);
    return response.data;
  },

  // Get KPIs
  async getKPIs(filters?: DashboardFilters): Promise<KPICard[]> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.set(key, String(value));
        }
      });
    }
    
    const response = await apiClient.get(`${BASE_URL}/kpis?${params.toString()}`);
    return response.data;
  },

  // Get work orders by status
  async getWorkOrdersByStatus(filters?: DashboardFilters): Promise<WorkOrderStatusCount[]> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.set(key, String(value));
        }
      });
    }
    
    const response = await apiClient.get(`${BASE_URL}/work-orders-by-status?${params.toString()}`);
    return response.data;
  },

  // Get active technicians
  async getActiveTechnicians(): Promise<TechnicianStatus[]> {
    const response = await apiClient.get(`${BASE_URL}/technicians/active`);
    return response.data;
  },

  // Get overdue orders
  async getOverdueOrders(limit?: number): Promise<OverdueOrder[]> {
    const params = limit ? `?limit=${limit}` : '';
    const response = await apiClient.get(`${BASE_URL}/overdue-orders${params}`);
    return response.data;
  },

  // Get recent activity
  async getRecentActivity(limit?: number): Promise<RecentActivity[]> {
    const params = limit ? `?limit=${limit}` : '';
    const response = await apiClient.get(`${BASE_URL}/activity${params}`);
    return response.data;
  },

  // Get summary
  async getSummary(filters?: DashboardFilters): Promise<DashboardSummary> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.set(key, String(value));
        }
      });
    }
    
    const response = await apiClient.get(`${BASE_URL}/summary?${params.toString()}`);
    return response.data;
  },

  // Get time series data for charts
  async getWorkOrdersTimeSeries(
    metric: 'created' | 'completed' | 'cancelled',
    period: 'day' | 'week' | 'month',
    filters?: DashboardFilters
  ): Promise<{ date: string; value: number }[]> {
    const params = new URLSearchParams({
      metric,
      period,
    });
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.set(key, String(value));
        }
      });
    }
    
    const response = await apiClient.get(`${BASE_URL}/time-series?${params.toString()}`);
    return response.data;
  },
};
