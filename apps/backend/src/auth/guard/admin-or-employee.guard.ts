import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';

@Injectable()
export class AdminOrEmployeeGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Express.Request>();
    const user = request.user as { isAdmin?: boolean; isEmployee?: boolean } | undefined;
    if (user?.isAdmin || user?.isEmployee) {
      return true;
    }

    throw new ForbiddenException('Solo admin o employee');
  }
}
