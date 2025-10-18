import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';

@Injectable()
export class OwnershipGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // logged-in user
    const profileId = request.params.id; // id from URL

    if (user.id !== profileId) {
      throw new ForbiddenException('You can only access your own profile.');
    }

    return true;
  }
}
