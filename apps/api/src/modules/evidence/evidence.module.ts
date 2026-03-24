import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { MulterModule } from '@nestjs/platform-express';

// Application
import { EvidenceService } from './application/services/evidence.service';
import { StorageService } from './application/services/storage.service';

// Interface
import { EvidenceController, EvidenceDirectController } from './interface/controllers/evidence.controller';

// Infrastructure
import { PrismaEvidenceRepository } from './infrastructure/persistence/prisma-evidence.repository';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    MulterModule.register({
      limits: {
        fileSize: 50 * 1024 * 1024, // 50MB max
      },
    }),
  ],
  controllers: [EvidenceController, EvidenceDirectController],
  providers: [
    // Services
    EvidenceService,
    StorageService,

    // Repositories
    PrismaEvidenceRepository,
  ],
  exports: [EvidenceService],
})
export class EvidenceModule {}
