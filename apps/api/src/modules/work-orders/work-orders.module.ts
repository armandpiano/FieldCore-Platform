import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

// Application
import { WorkOrderService } from './application/services/work-order.service';

// Interface
import { WorkOrdersController } from './interface/controllers/work-orders.controller';

// Infrastructure
import { PrismaWorkOrderRepository } from './infrastructure/persistence/prisma-work-order.repository';
import { PrismaWorkOrderEventRepository } from './infrastructure/persistence/prisma-work-order-event.repository';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [WorkOrdersController],
  providers: [
    // Services
    WorkOrderService,

    // Repositories
    PrismaWorkOrderRepository,
    PrismaWorkOrderEventRepository,
  ],
  exports: [WorkOrderService],
})
export class WorkOrdersModule {}
