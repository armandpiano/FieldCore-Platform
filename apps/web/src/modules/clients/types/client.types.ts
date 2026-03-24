// Client Types for FieldCore

export type ClientType = 'company' | 'individual';
export type ClientStatus = 'active' | 'inactive';

export interface ClientContact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role?: string;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ClientSite {
  id: string;
  clientId: string;
  name: string;
  address: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  id: string;
  organizationId: string;
  name: string;
  type: ClientType;
  rfc?: string; // Tax ID for Mexico
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country: string;
  status: ClientStatus;
  notes?: string;
  contacts?: ClientContact[];
  sites?: ClientSite[];
  workOrdersCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateClientRequest {
  name: string;
  type: ClientType;
  rfc?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  notes?: string;
}

export interface UpdateClientRequest extends Partial<CreateClientRequest> {
  status?: ClientStatus;
}

export interface CreateSiteRequest {
  clientId: string;
  name: string;
  address: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  notes?: string;
}

export interface UpdateSiteRequest extends Partial<CreateSiteRequest> {
  isActive?: boolean;
}

export interface CreateContactRequest {
  clientId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role?: string;
  isPrimary?: boolean;
}

export interface UpdateContactRequest extends Partial<CreateContactRequest> {}

export interface ClientFilters {
  search?: string;
  status?: ClientStatus;
  type?: ClientType;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
