/**
 * FieldCore Types - Shared TypeScript Types
 */

// Organization Types
export type OrganizationPlan = 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE';

export interface Organization {
  id: string;
  name: string;
  slug: string;
  plan: OrganizationPlan;
  settings: Record<string, any>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// User Types
export type UserRole = 'ADMIN' | 'SUPERVISOR' | 'TECHNICIAN' | 'VIEWER';

export interface User {
  id: string;
  email: string;
  name: string;
  lastName: string;
  role: UserRole;
  organizationId: string;
  isActive: boolean;
  createdAt: Date;
}

// Client Types
export interface Client {
  id: string;
  organizationId: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  isActive: boolean;
  createdAt: Date;
}

// Work Order Types
export type WorkOrderStatus = 'PENDING' | 'ASSIGNED' | 'IN_PROGRESS' | 'PAUSED' | 'COMPLETED' | 'CANCELLED';
export type WorkOrderPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type SlaStatus = 'ON_TRACK' | 'AT_RISK' | 'BREACHED';

export interface WorkOrder {
  id: string;
  folio: string;
  title: string;
  description?: string;
  status: WorkOrderStatus;
  priority: WorkOrderPriority;
  clientId: string;
  technicianId?: string;
  scheduledDate: Date;
  slaDeadline: Date;
  slaStatus: SlaStatus;
  createdAt: Date;
}

// Evidence Types
export type EvidenceType = 'PHOTO' | 'VIDEO' | 'DOCUMENT' | 'SIGNATURE' | 'AUDIO';
export type EvidenceCategory = 'BEFORE' | 'DURING' | 'AFTER' | 'SIGNATURE' | 'DOCUMENT';

export interface Evidence {
  id: string;
  workOrderId: string;
  type: EvidenceType;
  category: EvidenceCategory;
  url: string;
  capturedAt: Date;
}

// API Response Types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}
