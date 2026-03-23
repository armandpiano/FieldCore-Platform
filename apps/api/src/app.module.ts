/**
 * AppModule - Root Module
 * FieldCore API Application Module
 */

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bullmq';

import { PrismaModule } from './shared/infrastructure/database/prisma.module';
import { RedisModule } from './shared/infrastructure/cache/redis.module';
import { HealthModule } from './modules/health/health.module';
import { IdentityModule } from './modules/identity/identity.module';
import { WorkOrdersModule } from './modules/work-orders/work-orders.module';
import { ClientsModule } from './modules/clients/clients.module';
import { TechniciansModule } from './modules/technicians/technicians.module';
import { EvidenceModule } from './modules/evidence/evidence.module';
import { ReportsModule } from './modules/reports/reports.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),

    // Rate Limiting
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),

    // Scheduled Tasks
    ScheduleModule.forRoot(),

    // Queue (BullMQ)
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
      },
    }),

    // Infrastructure
    PrismaModule,
    RedisModule,

    // Feature Modules
    HealthModule,
    IdentityModule,
    WorkOrdersModule,
    ClientsModule,
    TechniciansModule,
    EvidenceModule,
    ReportsModule,
  ],
})
export class AppModule {}
