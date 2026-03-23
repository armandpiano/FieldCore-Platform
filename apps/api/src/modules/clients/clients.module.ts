import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

// Application
import { ClientService } from './application/services/client.service';

// Interface
import { ClientsController } from './interface/controllers/clients.controller';

// Infrastructure
import { PrismaClientRepository } from './infrastructure/persistence/prisma-client.repository';
import { PrismaSiteRepository } from './infrastructure/persistence/prisma-client-site.repository';
import { PrismaContactRepository } from './infrastructure/persistence/prisma-client-contact.repository';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [ClientsController],
  providers: [
    // Services
    ClientService,

    // Repositories
    PrismaClientRepository,
    PrismaSiteRepository,
    PrismaContactRepository,
  ],
  exports: [ClientService],
})
export class ClientsModule {}
