import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';

@Injectable()
export class ExceptOwnershipGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // logged-in user
    const profileId = request.params.id; // id from URL

    if (user.id === profileId) {
      throw new ForbiddenException('You cannot access your own profile with this route.');
    }

    return true;
  }
}
