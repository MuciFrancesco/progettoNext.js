import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Express.Request>();
    const user = request.user as { isAdmin?: boolean } | undefined;
    if (user?.isAdmin) {
      return true;
    }

    throw new ForbiddenException('Solo admin');
  }
}
