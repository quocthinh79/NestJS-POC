import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any) {
    const message =
      err?.message ?? (typeof info === 'string' ? info : info?.message) ?? 'Unauthorized';

    if (err || !user) {
      throw new UnauthorizedException(message);
    }
    return user;
  }
}
