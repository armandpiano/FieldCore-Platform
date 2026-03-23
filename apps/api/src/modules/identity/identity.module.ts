import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Application
import { AuthService } from './application/services/auth.service';
import { UserService } from './application/services/user.service';

// Interface
import { AuthController } from './interface/controllers/auth.controller';
import { UsersController } from './interface/controllers/users.controller';
import { JwtStrategy } from './interface/strategies/jwt.strategy';
import { RefreshTokenStrategy } from './interface/strategies/refresh-token.strategy';
import { JwtAuthGuard } from './interface/guards/jwt-auth.guard';
import { RolesGuard } from './interface/guards/roles.guard';
import { OrganizationGuard } from './interface/guards/organization.guard';

// Infrastructure
import { PrismaUserRepository } from './infrastructure/persistence/prisma-user.repository';
import { PrismaSessionRepository } from './infrastructure/persistence/prisma-session.repository';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'fieldcore-secret-key'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_ACCESS_EXPIRES', '15m'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController, UsersController],
  providers: [
    // Services
    AuthService,
    UserService,
    
    // Strategies
    JwtStrategy,
    RefreshTokenStrategy,
    
    // Guards
    JwtAuthGuard,
    RolesGuard,
    OrganizationGuard,
    
    // Repositories
    PrismaUserRepository,
    PrismaSessionRepository,
  ],
  exports: [
    AuthService,
    UserService,
    JwtAuthGuard,
    RolesGuard,
    OrganizationGuard,
  ],
})
export class IdentityModule {}
