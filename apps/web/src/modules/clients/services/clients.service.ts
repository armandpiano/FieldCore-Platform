import apiClient from '@/lib/api-client';
import type {
  Client,
  ClientFilters,
  CreateClientRequest,
  UpdateClientRequest,
  ClientSite,
  CreateSiteRequest,
  UpdateSiteRequest,
  ClientContact,
  CreateContactRequest,
  UpdateContactRequest,
  PaginatedResponse,
} from '../types/client.types';

// Client Service
export const clientsService = {
  /**
   * Get paginated list of clients
   */
  async list(filters?: ClientFilters): Promise<PaginatedResponse<Client>> {
    const { data } = await apiClient.get<PaginatedResponse<Client>>('/api/v1/clients', {
      params: filters,
    });
    return data;
  },

  /**
   * Get client by ID with full details
   */
  async getById(id: string): Promise<Client> {
    const { data } = await apiClient.get<Client>(`/api/v1/clients/${id}`);
    return data;
  },

  /**
   * Create a new client
   */
  async create(payload: CreateClientRequest): Promise<Client> {
    const { data } = await apiClient.post<Client>('/api/v1/clients', payload);
    return data;
  },

  /**
   * Update client
   */
  async update(id: string, payload: UpdateClientRequest): Promise<Client> {
    const { data } = await apiClient.patch<Client>(`/api/v1/clients/${id}`, payload);
    return data;
  },

  /**
   * Delete client (soft delete)
   */
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/api/v1/clients/${id}`);
  },

  /**
   * Get client sites
   */
  async getSites(clientId: string): Promise<ClientSite[]> {
    const { data } = await apiClient.get<ClientSite[]>(`/api/v1/clients/${clientId}/sites`);
    return data;
  },

  /**
   * Create a site for client
   */
  async createSite(clientId: string, payload: CreateSiteRequest): Promise<ClientSite> {
    const { data } = await apiClient.post<ClientSite>(`/api/v1/clients/${clientId}/sites`, payload);
    return data;
  },

  /**
   * Update site
   */
  async updateSite(clientId: string, siteId: string, payload: UpdateSiteRequest): Promise<ClientSite> {
    const { data } = await apiClient.patch<ClientSite>(
      `/api/v1/clients/${clientId}/sites/${siteId}`,
      payload
    );
    return data;
  },

  /**
   * Delete site
   */
  async deleteSite(clientId: string, siteId: string): Promise<void> {
    await apiClient.delete(`/api/v1/clients/${clientId}/sites/${siteId}`);
  },

  /**
   * Get client contacts
   */
  async getContacts(clientId: string): Promise<ClientContact[]> {
    const { data } = await apiClient.get<ClientContact[]>(`/api/v1/clients/${clientId}/contacts`);
    return data;
  },

  /**
   * Create contact for client
   */
  async createContact(clientId: string, payload: CreateContactRequest): Promise<ClientContact> {
    const { data } = await apiClient.post<ClientContact>(`/api/v1/clients/${clientId}/contacts`, payload);
    return data;
  },

  /**
   * Update contact
   */
  async updateContact(
    clientId: string,
    contactId: string,
    payload: UpdateContactRequest
  ): Promise<ClientContact> {
    const { data } = await apiClient.patch<ClientContact>(
      `/api/v1/clients/${clientId}/contacts/${contactId}`,
      payload
    );
    return data;
  },

  /**
   * Delete contact
   */
  async deleteContact(clientId: string, contactId: string): Promise<void> {
    await apiClient.delete(`/api/v1/clients/${clientId}/contacts/${contactId}`);
  },

  /**
   * Get client statistics
   */
  async getStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    companies: number;
    individuals: number;
  }> {
    const { data } = await apiClient.get('/api/v1/clients/stats');
    return data;
  },
};

export default clientsService;
