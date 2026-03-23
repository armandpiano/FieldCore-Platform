/**
 * WorkOrdersController - REST API Controller
 */

import {
  Controller, Get, Post, Patch, Body, Param, Query, UseGuards, HttpCode, HttpStatus
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../../shared/interface/guards/jwt-auth.guard';
import { CurrentUser, OrganizationId } from '../../../../shared/interface/decorators/current-user.decorator';
import { CreateWorkOrderUseCase } from '../../application/use-cases/create-work-order.usecase';
import { ListWorkOrdersUseCase } from '../../application/use-cases/list-work-orders.usecase';
import { GetWorkOrderDetailUseCase } from '../../application/use-cases/get-work-order-detail.usecase';
import { AssignTechnicianUseCase } from '../../application/use-cases/assign-technician.usecase';
import { StartServiceUseCase } from '../../application/use-cases/start-service.usecase';
import { CompleteWorkOrderUseCase } from '../../application/use-cases/complete-work-order.usecase';
import { CreateWorkOrderDto } from '../dto/create-work-order.dto';
import { AssignTechnicianDto } from '../dto/assign-technician.dto';

@ApiTags('work-orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'work-orders', version: '1' })
export class WorkOrdersController {
  constructor(
    private createWorkOrderUseCase: CreateWorkOrderUseCase,
    private listWorkOrdersUseCase: ListWorkOrdersUseCase,
    private getWorkOrderDetailUseCase: GetWorkOrderDetailUseCase,
    private assignTechnicianUseCase: AssignTechnicianUseCase,
    private startServiceUseCase: StartServiceUseCase,
    private completeWorkOrderUseCase: CompleteWorkOrderUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new work order' })
  async create(
    @Body() dto: CreateWorkOrderDto,
    @OrganizationId() organizationId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.createWorkOrderUseCase.execute({
      ...dto,
      organizationId,
      createdById: userId,
    });
  }

  @Get()
  @ApiOperation({ summary: 'List work orders' })
  async list(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @OrganizationId() organizationId: string,
  ) {
    return this.listWorkOrdersUseCase.execute({
      organizationId,
      pagination: { page: Number(page), limit: Number(limit) },
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get work order details' })
  async getOne(@Param('id') id: string, @OrganizationId() organizationId: string) {
    return this.getWorkOrderDetailUseCase.execute({ id, organizationId });
  }

  @Patch(':id/assign')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Assign technician' })
  async assign(
    @Param('id') id: string,
    @Body() dto: AssignTechnicianDto,
    @OrganizationId() organizationId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.assignTechnicianUseCase.execute({
      workOrderId: id,
      technicianId: dto.technicianId,
      organizationId,
      assignedById: userId,
    });
  }

  @Patch(':id/start')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Start work order' })
  async start(@Param('id') id: string, @OrganizationId() organizationId: string) {
    return this.startServiceUseCase.execute({ workOrderId: id, organizationId });
  }

  @Patch(':id/complete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Complete work order' })
  async complete(
    @Param('id') id: string,
    @Body() dto: any,
    @OrganizationId() organizationId: string,
  ) {
    return this.completeWorkOrderUseCase.execute({ workOrderId: id, organizationId, ...dto });
  }
}
