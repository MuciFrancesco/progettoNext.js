import type { APIRequestContext, BrowserContext } from '@playwright/test';
import { expect } from '@playwright/test';
import { authTestIds } from './auth-test-ids';

export const BACKEND_BASE_URL = process.env.BACKEND_URL ?? 'http://127.0.0.1:3333';
export const DEFAULT_PASSWORD = process.env.E2E_PASSWORD ?? 'E2e$Test1';

export type TestUserRole = 'USER' | 'ADMIN';

export type TestUser = {
  readonly email: string;
  readonly password: string;
  readonly role: TestUserRole;
};

export async function isBackendReachable(request: APIRequestContext): Promise<boolean> {
  try {
    const response = await request.get(BACKEND_BASE_URL);
    return response.status() < 500;
  } catch {
    return false;
  }
}

export function buildTestUser(role: TestUserRole, seed: string): TestUser {
  return {
    email: `${role.toLowerCase()}-${seed}-${Date.now()}@example.com`,
    password: DEFAULT_PASSWORD,
    role,
  };
}

export async function registerUser(api: APIRequestContext, user: TestUser): Promise<void> {
  const response = await api.post(`${BACKEND_BASE_URL}/auth/signup`, {
    data: {
      email: user.email,
      password: user.password,
      firstName: user.role === 'ADMIN' ? 'Admin' : 'User',
      lastName: 'E2E',
    },
  });

  const allowedStatuses = new Set([200, 201, 409]);
  expect(allowedStatuses.has(response.status())).toBeTruthy();

  if (user.role === 'ADMIN') {
    const { promoteUserToAdmin } = await import('./test-user-store');
    await promoteUserToAdmin(user.email);
  }
}

export async function signInViaApi(
  api: APIRequestContext,
  context: BrowserContext,
  user: TestUser
): Promise<void> {
  const response = await api.post(`${BACKEND_BASE_URL}/auth/signin`, {
    data: {
      email: user.email,
      password: user.password,
    },
  });

  expect(response.ok()).toBeTruthy();
  const payload = (await response.json()) as { access_token?: string };
  expect(payload.access_token).toBeTruthy();

  await context.addCookies([
    {
      name: 'access_token',
      value: payload.access_token!,
      domain: '127.0.0.1',
      path: '/',
      httpOnly: true,
      sameSite: 'Lax',
    },
  ]);
}

export async function expectLockoutWarningVisible(
  page: import('@playwright/test').Page
): Promise<void> {
  await expect(page.getByTestId(authTestIds.signinBlockedAlert)).toBeVisible();
}
