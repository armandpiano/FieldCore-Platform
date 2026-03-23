/**
 * PrismaModule - Database Module
 * Provides PrismaService globally
 */

import { Module, Global, Provider } from '@nestjs/common';
import { PrismaService } from './prisma.service';

export const PRISMA_SERVICE = 'PRISMA_SERVICE';

const prismaProvider: Provider = {
  provide: PRISMA_SERVICE,
  useClass: PrismaService,
};

@Global()
@Module({
  providers: [prismaProvider],
  exports: [PRISMA_SERVICE],
})
export class PrismaModule {}
