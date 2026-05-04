import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { AdminGuard } from './admin.guard';

function createContext(user: unknown): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => ({ user }),
    }),
  } as ExecutionContext;
}

describe('AdminGuard', () => {
  const guard = new AdminGuard();

  it('consente accesso agli admin', () => {
    expect(guard.canActivate(createContext({ isAdmin: true }))).toBe(true);
  });

  it('nega accesso agli utenti non admin', () => {
    expect(() => guard.canActivate(createContext({ isAdmin: false }))).toThrow(ForbiddenException);
  });
});
