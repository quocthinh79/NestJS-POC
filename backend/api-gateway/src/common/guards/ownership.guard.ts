import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';

@Injectable()
export class OwnershipGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // logged-in user
    const profileId = request.params.id; // id from URL

    if (!user || !profileId) {
      throw new ForbiddenException({
        status: 403,
        errorMessage: 'Invalid request context',
        errorCode: 'FORBIDDEN',
      });
    }

    if (user.id !== profileId) {
      throw new ForbiddenException({
        status: 403,
        errorMessage: 'You do not own this resource',
        errorCode: 'FORBIDDEN',
      });
    }

    return true;
  }
}
