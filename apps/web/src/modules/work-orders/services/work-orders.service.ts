import { apiClient } from '@/lib/api-client';
import {
  WorkOrder,
  WorkOrderFilters,
  PaginatedResponse,
  CreateWorkOrderRequest,
  UpdateWorkOrderRequest,
  AssignTechnicianRequest,
  ChangeStatusRequest,
  AddCommentRequest,
  WorkOrderComment,
  Evidence,
  Technician,
} from '../types/work-order.types';

const BASE_URL = '/api/v1/work-orders';

export const workOrdersService = {
  // List work orders with filters
  async list(filters?: WorkOrderFilters): Promise<PaginatedResponse<WorkOrder>> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(v => params.append(key, v));
          } else {
            params.set(key, String(value));
          }
        }
      });
    }
    
    const response = await apiClient.get(`${BASE_URL}?${params.toString()}`);
    return response.data;
  },

  // Get single work order by ID
  async getById(id: string): Promise<WorkOrder> {
    const response = await apiClient.get(`${BASE_URL}/${id}`);
    return response.data;
  },

  // Create new work order
  async create(payload: CreateWorkOrderRequest): Promise<WorkOrder> {
    const response = await apiClient.post(BASE_URL, payload);
    return response.data;
  },

  // Update work order
  async update(id: string, payload: UpdateWorkOrderRequest): Promise<WorkOrder> {
    const response = await apiClient.patch(`${BASE_URL}/${id}`, payload);
    return response.data;
  },

  // Delete work order
  async delete(id: string): Promise<void> {
    await apiClient.delete(`${BASE_URL}/${id}`);
  },

  // Assign technician to work order
  async assignTechnician(id: string, payload: AssignTechnicianRequest): Promise<WorkOrder> {
    const response = await apiClient.post(`${BASE_URL}/${id}/assign`, payload);
    return response.data;
  },

  // Change work order status
  async changeStatus(id: string, payload: ChangeStatusRequest): Promise<WorkOrder> {
    const response = await apiClient.post(`${BASE_URL}/${id}/status`, payload);
    return response.data;
  },

  // Start service (technician marks as in_progress)
  async startService(id: string): Promise<WorkOrder> {
    const response = await apiClient.post(`${BASE_URL}/${id}/start`);
    return response.data;
  },

  // Mark arrival at site
  async markArrival(id: string, latitude?: number, longitude?: number): Promise<WorkOrder> {
    const response = await apiClient.post(`${BASE_URL}/${id}/arrive`, { latitude, longitude });
    return response.data;
  },

  // Complete service
  async completeService(id: string, comment?: string): Promise<WorkOrder> {
    const response = await apiClient.post(`${BASE_URL}/${id}/complete`, { comment });
    return response.data;
  },

  // Get work order comments
  async getComments(id: string): Promise<WorkOrderComment[]> {
    const response = await apiClient.get(`${BASE_URL}/${id}/comments`);
    return response.data;
  },

  // Add comment
  async addComment(id: string, payload: AddCommentRequest): Promise<WorkOrderComment> {
    const response = await apiClient.post(`${BASE_URL}/${id}/comments`, payload);
    return response.data;
  },

  // Delete comment
  async deleteComment(workOrderId: string, commentId: string): Promise<void> {
    await apiClient.delete(`${BASE_URL}/${workOrderId}/comments/${commentId}`);
  },

  // Get work order evidence
  async getEvidence(id: string): Promise<Evidence[]> {
    const response = await apiClient.get(`${BASE_URL}/${id}/evidence`);
    return response.data;
  },

  // Upload evidence
  async uploadEvidence(
    id: string,
    file: File,
    type: Evidence['type'],
    description?: string,
    latitude?: number,
    longitude?: number
  ): Promise<Evidence> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    if (description) formData.append('description', description);
    if (latitude) formData.append('latitude', String(latitude));
    if (longitude) formData.append('longitude', String(longitude));
    
    const response = await apiClient.post(`${BASE_URL}/${id}/evidence`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Delete evidence
  async deleteEvidence(workOrderId: string, evidenceId: string): Promise<void> {
    await apiClient.delete(`${BASE_URL}/${workOrderId}/evidence/${evidenceId}`);
  },

  // Get available technicians
  async getAvailableTechnicians(date?: string): Promise<Technician[]> {
    const params = date ? `?date=${date}` : '';
    const response = await apiClient.get(`/api/v1/technicians/available${params}`);
    return response.data;
  },

  // Get work order timeline/events
  async getTimeline(id: string): Promise<WorkOrder['events']> {
    const response = await apiClient.get(`${BASE_URL}/${id}/timeline`);
    return response.data;
  },

  // Reassign technician
  async reassignTechnician(id: string, technicianId: string): Promise<WorkOrder> {
    const response = await apiClient.post(`${BASE_URL}/${id}/reassign`, { technicianId });
    return response.data;
  },

  // Cancel work order
  async cancel(id: string, reason?: string): Promise<WorkOrder> {
    const response = await apiClient.post(`${BASE_URL}/${id}/cancel`, { reason });
    return response.data;
  },
};
