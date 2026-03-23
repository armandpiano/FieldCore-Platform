import { IsString, IsOptional, IsEnum, IsNumber, IsDateString, MaxLength, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { WorkOrderStatus, WorkOrderPriority, WorkOrderType, WorkOrderLocation, WorkOrderSchedule } from '../../domain/entities/work-order.entity';

export class CreateWorkOrderDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  description!: string;

  @IsString()
  clientId!: string;

  @IsString()
  @IsOptional()
  clientSiteId?: string;

  @IsEnum(WorkOrderType)
  type!: WorkOrderType;

  @IsEnum(WorkOrderPriority)
  @IsOptional()
  priority?: WorkOrderPriority;

  @IsObject()
  @IsOptional()
  schedule?: WorkOrderSchedule;

  @IsObject()
  @IsOptional()
  location?: WorkOrderLocation;

  @IsNumber()
  @IsOptional()
  estimatedCost?: number;

  @IsDateString()
  @IsOptional()
  slaDeadline?: string;
}

export class UpdateWorkOrderDto {
  @IsString()
  @IsOptional()
  @MaxLength(200)
  title?: string;

  @IsString()
  @IsOptional()
  @MaxLength(2000)
  description?: string;

  @IsEnum(WorkOrderType)
  @IsOptional()
  type?: WorkOrderType;

  @IsEnum(WorkOrderPriority)
  @IsOptional()
  priority?: WorkOrderPriority;

  @IsObject()
  @IsOptional()
  schedule?: WorkOrderSchedule;

  @IsObject()
  @IsOptional()
  location?: WorkOrderLocation;

  @IsNumber()
  @IsOptional()
  estimatedCost?: number;

  @IsDateString()
  @IsOptional()
  slaDeadline?: string;
}

export class AssignTechnicianDto {
  @IsString()
  @IsNotEmpty()
  technicianId!: string;
}

export class CancelWorkOrderDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  reason!: string;
}

export class CompleteWorkOrderDto {
  @IsNumber()
  @IsOptional()
  actualCost?: number;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  notes?: string;
}

export class WorkOrderResponseDto {
  id!: string;
  organizationId!: string;
  clientId!: string;
  clientSiteId?: string;
  folio!: string;
  title!: string;
  description!: string;
  type!: string;
  priority!: string;
  status!: string;
  assignedTechnicianId?: string;
  assignedAt?: Date;
  assignedBy?: string;
  schedule!: WorkOrderSchedule;
  location!: WorkOrderLocation;
  estimatedCost?: number;
  actualCost?: number;
  startedAt?: Date;
  pausedAt?: Date;
  pausedDurationMinutes!: number;
  completedAt?: Date;
  cancelledAt?: Date;
  cancelledBy?: string;
  cancellationReason?: string;
  slaDeadline?: Date;
  slaBreached!: boolean;
  createdBy!: string;
  createdAt!: Date;
  updatedAt!: Date;
}

export class WorkOrderListItemDto {
  id!: string;
  folio!: string;
  title!: string;
  type!: string;
  priority!: string;
  status!: string;
  clientId!: string;
  assignedTechnicianId?: string;
  scheduledDate?: Date;
  slaDeadline?: Date;
  slaBreached!: boolean;
  createdAt!: Date;
}

export class WorkOrderFilterDto {
  @IsString()
  @IsOptional()
  status?: string;

  @IsEnum(WorkOrderPriority)
  @IsOptional()
  priority?: WorkOrderPriority;

  @IsEnum(WorkOrderType)
  @IsOptional()
  type?: WorkOrderType;

  @IsString()
  @IsOptional()
  clientId?: string;

  @IsString()
  @IsOptional()
  technicianId?: string;

  @IsString()
  @IsOptional()
  search?: string;

  @IsDateString()
  @IsOptional()
  dateFrom?: string;

  @IsDateString()
  @IsOptional()
  dateTo?: string;

  @IsString()
  @IsOptional()
  slaBreached?: string;
}

export class WorkOrderDetailDto extends WorkOrderResponseDto {
  clientName?: string;
  siteName?: string;
  technicianName?: string;
  events?: WorkOrderEventDto[];
}
