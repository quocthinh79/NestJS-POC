import { Injectable } from '@nestjs/common';

@Injectable()
export class PermissionService {
  canAccess(userRole: string, requiredRoles: string[]): boolean {
    if (!requiredRoles || requiredRoles.length === 0) return true;
    return requiredRoles.includes(userRole);
  }
}
