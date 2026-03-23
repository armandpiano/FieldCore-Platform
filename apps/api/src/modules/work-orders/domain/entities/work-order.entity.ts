import { Entity } from '../../../shared/domain/base/entity';

export enum WorkOrderStatus {
  DRAFT = 'draft',
  PENDING_ASSIGNMENT = 'pending_assignment',
  ASSIGNED = 'assigned',
  IN_PROGRESS = 'in_progress',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum WorkOrderPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export enum WorkOrderType {
  PREVENTIVE = 'preventive',
  CORRECTIVE = 'corrective',
  INSTALLATION = 'installation',
  MAINTENANCE = 'maintenance',
  INSPECTION = 'inspection',
  DELIVERY = 'delivery',
  OTHER = 'other',
}

export interface WorkOrderLocation {
  street?: string;
  exteriorNumber?: string;
  interiorNumber?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
}

export interface WorkOrderSchedule {
  scheduledDate?: Date;
  scheduledStartTime?: string;
  scheduledEndTime?: string;
  estimatedDurationMinutes?: number;
}

export interface WorkOrderProps {
  organizationId: string;
  clientId: string;
  clientSiteId?: string;
  
  // Identification
  folio: string;
  title: string;
  description: string;
  type: WorkOrderType;
  priority: WorkOrderPriority;
  
  // Status
  status: WorkOrderStatus;
  
  // Assignment
  assignedTechnicianId?: string;
  assignedAt?: Date;
  assignedBy?: string;
  
  // Schedule
  schedule: WorkOrderSchedule;
  
  // Location
  location: WorkOrderLocation;
  
  // Cost
  estimatedCost?: number;
  actualCost?: number;
  
  // Dates
  startedAt?: Date;
  pausedAt?: Date;
  pausedDurationMinutes?: number;
  completedAt?: Date;
  cancelledAt?: Date;
  cancelledBy?: string;
  cancellationReason?: string;
  
  // SLA
  slaDeadline?: Date;
  slaBreached: boolean;
  
  // Timestamps
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export class WorkOrderEntity extends Entity<WorkOrderProps> {
  private constructor(props: WorkOrderProps, id?: string) {
    super(props, id);
  }

  static create(props: WorkOrderProps, id?: string): WorkOrderEntity {
    return new WorkOrderEntity(
      {
        ...props,
        slaBreached: props.slaBreached || false,
        pausedDurationMinutes: props.pausedDurationMinutes || 0,
        createdAt: props.createdAt || new Date(),
        updatedAt: props.updatedAt || new Date(),
      },
      id,
    );
  }

  static createNew(
    organizationId: string,
    clientId: string,
    createdBy: string,
    title: string,
    description: string,
    type: WorkOrderType,
    priority: WorkOrderPriority,
  ): WorkOrderEntity {
    const folio = WorkOrderEntity.generateFolio();
    return WorkOrderEntity.create({
      organizationId,
      clientId,
      folio,
      title,
      description,
      type,
      priority,
      status: WorkOrderStatus.DRAFT,
      createdBy,
      schedule: {},
      location: {},
      slaBreached: false,
      pausedDurationMinutes: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  private static generateFolio(): string {
    const prefix = 'WO';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  }

  // Getters
  get organizationId(): string { return this.props.organizationId; }
  get clientId(): string { return this.props.clientId; }
  get clientSiteId(): string | undefined { return this.props.clientSiteId; }
  get folio(): string { return this.props.folio; }
  get title(): string { return this.props.title; }
  get description(): string { return this.props.description; }
  get type(): WorkOrderType { return this.props.type; }
  get priority(): WorkOrderPriority { return this.props.priority; }
  get status(): WorkOrderStatus { return this.props.status; }
  get assignedTechnicianId(): string | undefined { return this.props.assignedTechnicianId; }
  get assignedAt(): Date | undefined { return this.props.assignedAt; }
  get assignedBy(): string | undefined { return this.props.assignedBy; }
  get schedule(): WorkOrderSchedule { return this.props.schedule; }
  get location(): WorkOrderLocation { return this.props.location; }
  get slaDeadline(): Date | undefined { return this.props.slaDeadline; }
  get isSlaBreached(): boolean { return this.props.slaBreached; }
  get startedAt(): Date | undefined { return this.props.startedAt; }
  get completedAt(): Date | undefined { return this.props.completedAt; }

  // Status checks
  isDraft(): boolean { return this.props.status === WorkOrderStatus.DRAFT; }
  isPendingAssignment(): boolean { return this.props.status === WorkOrderStatus.PENDING_ASSIGNMENT; }
  isAssigned(): boolean { return this.props.status === WorkOrderStatus.ASSIGNED; }
  isInProgress(): boolean { return this.props.status === WorkOrderStatus.IN_PROGRESS; }
  isPaused(): boolean { return this.props.status === WorkOrderStatus.PAUSED; }
  isCompleted(): boolean { return this.props.status === WorkOrderStatus.COMPLETED; }
  isCancelled(): boolean { return this.props.status === WorkOrderStatus.CANCELLED; }
  isActive(): boolean {
    return !this.isCompleted() && !this.isCancelled();
  }
  canBeModified(): boolean {
    return [WorkOrderStatus.DRAFT, WorkOrderStatus.PENDING_ASSIGNMENT].includes(this.props.status);
  }

  // State transitions
  submit(): void {
    if (this.props.status !== WorkOrderStatus.DRAFT) {
      throw new Error('Only draft orders can be submitted');
    }
    this.props.status = WorkOrderStatus.PENDING_ASSIGNMENT;
    this.touch();
  }

  assign(technicianId: string, assignedBy: string): void {
    if (![WorkOrderStatus.PENDING_ASSIGNMENT, WorkOrderStatus.ASSIGNED].includes(this.props.status)) {
      throw new Error('Order must be pending assignment or assigned to reassign');
    }
    this.props.assignedTechnicianId = technicianId;
    this.props.assignedAt = new Date();
    this.props.assignedBy = assignedBy;
    this.props.status = WorkOrderStatus.ASSIGNED;
    this.touch();
  }

  unassign(): void {
    if (this.props.status === WorkOrderStatus.IN_PROGRESS) {
      throw new Error('Cannot unassign an order that is in progress');
    }
    this.props.assignedTechnicianId = undefined;
    this.props.assignedAt = undefined;
    this.props.assignedBy = undefined;
    this.props.status = WorkOrderStatus.PENDING_ASSIGNMENT;
    this.touch();
  }

  start(): void {
    if (this.props.status !== WorkOrderStatus.ASSIGNED) {
      throw new Error('Order must be assigned to start');
    }
    if (!this.props.assignedTechnicianId) {
      throw new Error('A technician must be assigned to start');
    }
    this.props.status = WorkOrderStatus.IN_PROGRESS;
    this.props.startedAt = new Date();
    this.touch();
  }

  pause(): void {
    if (this.props.status !== WorkOrderStatus.IN_PROGRESS) {
      throw new Error('Only in-progress orders can be paused');
    }
    this.props.status = WorkOrderStatus.PAUSED;
    this.props.pausedAt = new Date();
    this.touch();
  }

  resume(): void {
    if (this.props.status !== WorkOrderStatus.PAUSED) {
      throw new Error('Only paused orders can be resumed');
    }
    if (this.props.pausedAt) {
      const pauseDuration = Math.floor((Date.now() - this.props.pausedAt.getTime()) / 60000);
      this.props.pausedDurationMinutes = (this.props.pausedDurationMinutes || 0) + pauseDuration;
    }
    this.props.status = WorkOrderStatus.IN_PROGRESS;
    this.props.pausedAt = undefined;
    this.touch();
  }

  complete(actualCost?: number): void {
    if (![WorkOrderStatus.IN_PROGRESS, WorkOrderStatus.ASSIGNED].includes(this.props.status)) {
      throw new Error('Order must be assigned or in progress to complete');
    }
    this.props.status = WorkOrderStatus.COMPLETED;
    this.props.completedAt = new Date();
    if (actualCost !== undefined) {
      this.props.actualCost = actualCost;
    }
    this.touch();
  }

  cancel(cancelledBy: string, reason: string): void {
    if ([WorkOrderStatus.COMPLETED, WorkOrderStatus.CANCELLED].includes(this.props.status)) {
      throw new Error('Completed or cancelled orders cannot be cancelled again');
    }
    this.props.status = WorkOrderStatus.CANCELLED;
    this.props.cancelledAt = new Date();
    this.props.cancelledBy = cancelledBy;
    this.props.cancellationReason = reason;
    this.touch();
  }

  // Updates
  update(data: Partial<WorkOrderProps>): void {
    if (!this.canBeModified()) {
      throw new Error('Order cannot be modified in current status');
    }
    Object.assign(this.props, data);
    this.touch();
  }

  updateSchedule(schedule: WorkOrderSchedule): void {
    this.props.schedule = { ...this.props.schedule, ...schedule };
    this.touch();
  }

  updateLocation(location: WorkOrderLocation): void {
    this.props.location = { ...this.props.location, ...location };
    this.touch();
  }

  setSLADeadline(deadline: Date): void {
    this.props.slaDeadline = deadline;
    this.touch();
  }

  breachSLA(): void {
    this.props.slaBreached = true;
    this.touch();
  }

  getTotalDurationMinutes(): number {
    if (!this.props.startedAt) return 0;
    const endTime = this.props.completedAt || new Date();
    const totalMinutes = Math.floor((endTime.getTime() - this.props.startedAt.getTime()) / 60000);
    return totalMinutes - (this.props.pausedDurationMinutes || 0);
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }
}
