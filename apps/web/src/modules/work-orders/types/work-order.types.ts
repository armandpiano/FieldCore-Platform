// Work Order Types for FieldCore

export type WorkOrderStatus = 
  | 'pending'           // Orden creada, pendiente de asignación
  | 'assigned'          // Técnico asignado
  | 'in_progress'      // Técnico en camino o iniciando servicio
  | 'on_site'           // Técnico llegó al sitio
  | 'completed'         // Servicio completado
  | 'cancelled'         // Orden cancelada
  | 'on_hold';         // En espera por alguna razón

export type WorkOrderPriority = 'low' | 'medium' | 'high' | 'urgent';
export type WorkOrderType = 'installation' | 'repair' | 'maintenance' | 'inspection' | 'emergency';

export interface WorkOrderEvent {
  id: string;
  workOrderId: string;
  type: 'created' | 'assigned' | 'status_change' | 'comment' | 'evidence_added' | 'location_update';
  description: string;
  previousValue?: string;
  newValue?: string;
  userId: string;
  userName: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
}

export interface WorkOrderComment {
  id: string;
  workOrderId: string;
  userId: string;
  userName: string;
  userRole: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Evidence {
  id: string;
  workOrderId: string;
  type: 'photo' | 'signature' | 'document' | 'video';
  url: string;
  thumbnailUrl?: string;
  filename: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  capturedAt: string;
  capturedBy: string;
  capturedByName: string;
  createdAt: string;
}

export interface Technician {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  status: 'available' | 'busy' | 'offline';
  currentLocation?: {
    latitude: number;
    longitude: number;
    updatedAt: string;
  };
}

export interface Client {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  rfc?: string;
}

export interface ClientSite {
  id: string;
  name: string;
  address: string;
  city?: string;
  state?: string;
  postalCode?: string;
  phone?: string;
  contactName?: string;
  contactPhone?: string;
  latitude?: number;
  longitude?: number;
}

export interface WorkOrder {
  id: string;
  organizationId: string;
  folio: string;
  clientId: string;
  client?: Client;
  siteId: string;
  site?: ClientSite;
  title: string;
  description: string;
  type: WorkOrderType;
  priority: WorkOrderPriority;
  status: WorkOrderStatus;
  scheduledDate: string;
  scheduledTimeStart?: string;
  scheduledTimeEnd?: string;
  assignedToId?: string;
  assignedTo?: Technician;
  estimatedDuration?: number; // en minutos
  actualDuration?: number;    // en minutos
  serviceAddress: string;
  latitude?: number;
  longitude?: number;
  observations?: string;
  closedAt?: string;
  closedById?: string;
  slaDeadline?: string;
  slaStatus?: 'ok' | 'at_risk' | 'breached';
  events?: WorkOrderEvent[];
  comments?: WorkOrderComment[];
  evidence?: Evidence[];
  createdById: string;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
}

// Request/Response types
export interface WorkOrderFilters {
  search?: string;
  status?: WorkOrderStatus | WorkOrderStatus[];
  priority?: WorkOrderPriority;
  type?: WorkOrderType;
  clientId?: string;
  assignedToId?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  pageSize?: number;
  sortBy?: 'scheduledDate' | 'priority' | 'status' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface CreateWorkOrderRequest {
  clientId: string;
  siteId: string;
  title: string;
  description: string;
  type: WorkOrderType;
  priority: WorkOrderPriority;
  scheduledDate: string;
  scheduledTimeStart?: string;
  scheduledTimeEnd?: string;
  estimatedDuration?: number;
  serviceAddress?: string;
  latitude?: number;
  longitude?: number;
  observations?: string;
}

export interface UpdateWorkOrderRequest {
  title?: string;
  description?: string;
  type?: WorkOrderType;
  priority?: WorkOrderPriority;
  scheduledDate?: string;
  scheduledTimeStart?: string;
  scheduledTimeEnd?: string;
  estimatedDuration?: number;
  serviceAddress?: string;
  latitude?: number;
  longitude?: number;
  observations?: string;
}

export interface AssignTechnicianRequest {
  technicianId: string;
  scheduledDate?: string;
  scheduledTimeStart?: string;
}

export interface ChangeStatusRequest {
  status: WorkOrderStatus;
  comment?: string;
}

export interface AddCommentRequest {
  content: string;
}

// Paginated response
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// Status display configuration
export const WORK_ORDER_STATUS_CONFIG: Record<WorkOrderStatus, {
  label: string;
  color: string;
  bgColor: string;
  icon: string;
}> = {
  pending: {
    label: 'Pendiente',
    color: 'text-slate-700',
    bgColor: 'bg-slate-100',
    icon: 'Clock',
  },
  assigned: {
    label: 'Asignada',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
    icon: 'UserCheck',
  },
  in_progress: {
    label: 'En Progreso',
    color: 'text-orange-700',
    bgColor: 'bg-orange-100',
    icon: 'MapPin',
  },
  on_site: {
    label: 'En Sitio',
    color: 'text-purple-700',
    bgColor: 'bg-purple-100',
    icon: 'MapPin',
  },
  completed: {
    label: 'Completada',
    color: 'text-green-700',
    bgColor: 'bg-green-100',
    icon: 'CheckCircle',
  },
  cancelled: {
    label: 'Cancelada',
    color: 'text-red-700',
    bgColor: 'bg-red-100',
    icon: 'XCircle',
  },
  on_hold: {
    label: 'En Espera',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-100',
    icon: 'Pause',
  },
};

export const PRIORITY_CONFIG: Record<WorkOrderPriority, {
  label: string;
  color: string;
  bgColor: string;
}> = {
  low: {
    label: 'Baja',
    color: 'text-slate-600',
    bgColor: 'bg-slate-100',
  },
  medium: {
    label: 'Media',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  high: {
    label: 'Alta',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
  },
  urgent: {
    label: 'Urgente',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
  },
};

export const TYPE_CONFIG: Record<WorkOrderType, {
  label: string;
  icon: string;
}> = {
  installation: {
    label: 'Instalación',
    icon: 'PackagePlus',
  },
  repair: {
    label: 'Reparación',
    icon: 'Wrench',
  },
  maintenance: {
    label: 'Mantenimiento',
    icon: 'Settings',
  },
  inspection: {
    label: 'Inspección',
    icon: 'Search',
  },
  emergency: {
    label: 'Emergencia',
    icon: 'AlertTriangle',
  },
};
