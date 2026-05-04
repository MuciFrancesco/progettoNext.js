import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { AdminOrEmployeeGuard } from './admin-or-employee.guard';

function createContext(user: unknown): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => ({ user }),
    }),
  } as ExecutionContext;
}

describe('AdminOrEmployeeGuard', () => {
  const guard = new AdminOrEmployeeGuard();

  it('consente accesso ad admin ed employee', () => {
    expect(guard.canActivate(createContext({ isAdmin: true, isEmployee: false }))).toBe(true);
    expect(guard.canActivate(createContext({ isAdmin: false, isEmployee: true }))).toBe(true);
  });

  it('nega accesso agli utenti standard', () => {
    expect(() => guard.canActivate(createContext({ isAdmin: false, isEmployee: false }))).toThrow(
      ForbiddenException
    );
  });
});
