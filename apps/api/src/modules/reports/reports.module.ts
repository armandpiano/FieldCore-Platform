import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

// Application
import { DashboardService } from './application/services/dashboard.service';

// Interface
import { DashboardController, ReportsController } from './interface/controllers/reports.controller';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [DashboardController, ReportsController],
  providers: [
    DashboardService,
  ],
  exports: [DashboardService],
})
export class ReportsModule {}
