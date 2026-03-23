/**
 * WorkOrdersModule - Work Orders Feature Module
 */

import { Module } from '@nestjs/common';
import { WorkOrdersController } from './interface/controllers/work-orders.controller';
import { CreateWorkOrderUseCase } from './application/use-cases/create-work-order.usecase';
import { ListWorkOrdersUseCase } from './application/use-cases/list-work-orders.usecase';
import { GetWorkOrderDetailUseCase } from './application/use-cases/get-work-order-detail.usecase';
import { AssignTechnicianUseCase } from './application/use-cases/assign-technician.usecase';
import { StartServiceUseCase } from './application/use-cases/start-service.usecase';
import { CompleteWorkOrderUseCase } from './application/use-cases/complete-work-order.usecase';

@Module({
  controllers: [WorkOrdersController],
  providers: [
    CreateWorkOrderUseCase,
    ListWorkOrdersUseCase,
    GetWorkOrderDetailUseCase,
    AssignTechnicianUseCase,
    StartServiceUseCase,
    CompleteWorkOrderUseCase,
  ],
  exports: [],
})
export class WorkOrdersModule {}
