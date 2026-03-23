import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_ORG_REQUIRED_KEY } from '../../shared/interface/decorators/organization.decorator';
import { AuthenticatedUser } from '../strategies/jwt.strategy';

@Injectable()
export class OrganizationGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requireOrg = this.reflector.getAllAndOverride<boolean>(IS_ORG_REQUIRED_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requireOrg) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: AuthenticatedUser = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    if (!user.organizationId) {
      throw new ForbiddenException('Organization context required');
    }

    const orgId = request.params.organizationId || request.body?.organizationId;
    if (orgId && orgId !== user.organizationId) {
      throw new ForbiddenException('Access to this organization is not allowed');
    }

    return true;
  }
}
