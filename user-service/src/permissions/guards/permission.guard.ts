import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { PermissionService } from '../permission.service';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private permissionService: PermissionService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();

    if (!this.permissionService.canAccess(user.role, requiredRoles)) {
      throw new ForbiddenException('Permission denied');
    }

    return true;
  }
}
