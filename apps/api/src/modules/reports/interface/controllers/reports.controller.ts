import {
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DashboardService } from '../../application/services/dashboard.service';
import { DashboardFilterDto, TechnicianPerformanceDto, ProductivityReportDto, ClientReportDto } from '../../application/dto/report.dto';
import { CurrentUser } from '../../../shared/interface/decorators/current-user.decorator';
import { Roles } from '../../../shared/interface/decorators/roles.decorator';
import { AuthenticatedUser } from '../../identity/interface/strategies/jwt.strategy';
import { UserRole } from '../../identity/domain/entities/user.entity';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('overview')
  @Roles(UserRole.OWNER, UserRole.ADMIN, UserRole.SUPERVISOR)
  async getOverview(
    @CurrentUser() user: AuthenticatedUser,
    @Query() filter: DashboardFilterDto,
  ) {
    const dateFilter = {
      dateFrom: filter.dateFrom ? new Date(filter.dateFrom) : undefined,
      dateTo: filter.dateTo ? new Date(filter.dateTo) : undefined,
    };

    return this.dashboardService.getOverview(user.organizationId, dateFilter);
  }

  @Get('technicians')
  @Roles(UserRole.OWNER, UserRole.ADMIN, UserRole.SUPERVISOR)
  async getTechnicianPerformance(
    @CurrentUser() user: AuthenticatedUser,
    @Query() filter: TechnicianPerformanceDto,
  ) {
    const dateFilter = {
      dateFrom: filter.dateFrom ? new Date(filter.dateFrom) : undefined,
      dateTo: filter.dateTo ? new Date(filter.dateTo) : undefined,
    };

    const limit = filter.limit ? parseInt(filter.limit, 10) : 10;
    return this.dashboardService.getTechnicianPerformance(
      user.organizationId,
      dateFilter,
      limit,
    );
  }

  @Get('productivity')
  @Roles(UserRole.OWNER, UserRole.ADMIN, UserRole.SUPERVISOR)
  async getProductivityTrend(
    @CurrentUser() user: AuthenticatedUser,
    @Query() filter: ProductivityReportDto,
  ) {
    const dateFilter = {
      dateFrom: filter.dateFrom ? new Date(filter.dateFrom) : undefined,
      dateTo: filter.dateTo ? new Date(filter.dateTo) : undefined,
    };

    return this.dashboardService.getProductivityTrend(
      user.organizationId,
      dateFilter,
      filter.groupBy || 'day',
    );
  }

  @Get('sla')
  @Roles(UserRole.OWNER, UserRole.ADMIN, UserRole.SUPERVISOR)
  async getSLAMetrics(
    @CurrentUser() user: AuthenticatedUser,
    @Query() filter: DashboardFilterDto,
  ) {
    const dateFilter = {
      dateFrom: filter.dateFrom ? new Date(filter.dateFrom) : undefined,
      dateTo: filter.dateTo ? new Date(filter.dateTo) : undefined,
    };

    return this.dashboardService.getSLAMetrics(user.organizationId, dateFilter);
  }

  @Get('clients')
  @Roles(UserRole.OWNER, UserRole.ADMIN, UserRole.SUPERVISOR)
  async getClientMetrics(
    @CurrentUser() user: AuthenticatedUser,
    @Query() filter: ClientReportDto,
  ) {
    const dateFilter = {
      dateFrom: filter.dateFrom ? new Date(filter.dateFrom) : undefined,
      dateTo: filter.dateTo ? new Date(filter.dateTo) : undefined,
    };

    const limit = filter.limit ? parseInt(filter.limit, 10) : 20;
    return this.dashboardService.getClientMetrics(
      user.organizationId,
      dateFilter,
      limit,
    );
  }
}

@Controller('reports')
export class ReportsController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('summary')
  @Roles(UserRole.OWNER, UserRole.ADMIN, UserRole.SUPERVISOR)
  async getReportSummary(
    @CurrentUser() user: AuthenticatedUser,
    @Query() filter: DashboardFilterDto,
  ) {
    const dateFilter = {
      dateFrom: filter.dateFrom ? new Date(filter.dateFrom) : undefined,
      dateTo: filter.dateTo ? new Date(filter.dateTo) : undefined,
    };

    const [overview, sla, technicians] = await Promise.all([
      this.dashboardService.getOverview(user.organizationId, dateFilter),
      this.dashboardService.getSLAMetrics(user.organizationId, dateFilter),
      this.dashboardService.getTechnicianPerformance(user.organizationId, dateFilter, 5),
    ]);

    return {
      overview,
      sla,
      topTechnicians: technicians.slice(0, 5),
      generatedAt: new Date(),
    };
  }

  @Get('technicians')
  @Roles(UserRole.OWNER, UserRole.ADMIN, UserRole.SUPERVISOR)
  async getTechniciansReport(
    @CurrentUser() user: AuthenticatedUser,
    @Query() filter: TechnicianPerformanceDto,
  ) {
    const dateFilter = {
      dateFrom: filter.dateFrom ? new Date(filter.dateFrom) : undefined,
      dateTo: filter.dateTo ? new Date(filter.dateTo) : undefined,
    };

    return this.dashboardService.getTechnicianPerformance(
      user.organizationId,
      dateFilter,
      parseInt(filter.limit || '20', 10),
    );
  }

  @Get('clients')
  @Roles(UserRole.OWNER, UserRole.ADMIN, UserRole.SUPERVISOR)
  async getClientsReport(
    @CurrentUser() user: AuthenticatedUser,
    @Query() filter: ClientReportDto,
  ) {
    const dateFilter = {
      dateFrom: filter.dateFrom ? new Date(filter.dateFrom) : undefined,
      dateTo: filter.dateTo ? new Date(filter.dateTo) : undefined,
    };

    return this.dashboardService.getClientMetrics(
      user.organizationId,
      dateFilter,
      parseInt(filter.limit || '20', 10),
    );
  }
}
