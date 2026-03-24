import apiClient from '@/lib/api-client';

export interface WorkOrder {
  id: string;
  title: string;
  status: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  client?: { id: string; name: string };
  technician?: { id: string; firstName: string; lastName: string };
  dueDate?: string;
  createdAt: string;
}

export const workOrdersService = {
  async list(params?: Record<string, any>) {
    const { data } = await apiClient.get('/api/v1/work-orders', { params });
    return data;
  },
  async getById(id: string) {
    const { data } = await apiClient.get<WorkOrder>(`/api/v1/work-orders/${id}`);
    return data;
  },
  async create(payload: Partial<WorkOrder>) {
    const { data } = await apiClient.post<WorkOrder>('/api/v1/work-orders', payload);
    return data;
  },
  async update(id: string, payload: Partial<WorkOrder>) {
    const { data } = await apiClient.patch<WorkOrder>(`/api/v1/work-orders/${id}`, payload);
    return data;
  },
};
