import { IsString, IsOptional, IsDateString, IsEnum } from 'class-validator';

export class DashboardFilterDto {
  @IsDateString()
  @IsOptional()
  dateFrom?: string;

  @IsDateString()
  @IsOptional()
  dateTo?: string;

  @IsString()
  @IsOptional()
  technicianId?: string;

  @IsString()
  @IsOptional()
  clientId?: string;

  @IsString()
  @IsOptional()
  status?: string;
}

export class TechnicianPerformanceDto {
  @IsString()
  @IsOptional()
  dateFrom?: string;

  @IsDateString()
  @IsDateString()
  @IsOptional()
  dateTo?: string;

  @IsString()
  @IsOptional()
  limit?: string;
}

export class ProductivityReportDto {
  @IsDateString()
  @IsOptional()
  dateFrom?: string;

  @IsDateString()
  @IsOptional()
  dateTo?: string;

  @IsString()
  @IsOptional()
  groupBy?: 'day' | 'week' | 'month';
}

export class ClientReportDto {
  @IsDateString()
  @IsOptional()
  dateFrom?: string;

  @IsDateString()
  @IsOptional()
  dateTo?: string;

  @IsString()
  @IsOptional()
  sortBy?: 'total' | 'completed' | 'pending' | 'avgTime';

  @IsString()
  @IsOptional()
  sortOrder?: 'asc' | 'desc';

  @IsString()
  @IsOptional()
  limit?: string;
}
