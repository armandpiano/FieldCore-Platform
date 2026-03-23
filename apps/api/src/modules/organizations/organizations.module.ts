import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

// Application
import { OrganizationService } from './application/services/organization.service';
import { MembershipService } from './application/services/membership.service';

// Interface
import { OrganizationsController, InvitationsController, MyOrganizationsController } from './interface/controllers/organizations.controller';

// Infrastructure
import { PrismaOrganizationRepository } from './infrastructure/persistence/prisma-organization.repository';
import { PrismaMembershipRepository } from './infrastructure/persistence/prisma-membership.repository';
import { PrismaInvitationRepository } from './infrastructure/persistence/prisma-invitation.repository';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [
    OrganizationsController,
    InvitationsController,
    MyOrganizationsController,
  ],
  providers: [
    // Services
    OrganizationService,
    MembershipService,

    // Repositories
    PrismaOrganizationRepository,
    PrismaMembershipRepository,
    PrismaInvitationRepository,
  ],
  exports: [
    OrganizationService,
    MembershipService,
  ],
})
export class OrganizationsModule {}
