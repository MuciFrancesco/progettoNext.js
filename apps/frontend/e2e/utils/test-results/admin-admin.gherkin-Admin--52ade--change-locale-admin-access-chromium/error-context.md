# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin\admin.gherkin.spec.ts >> Admin protected flows >> Admin can open dashboard, see user grid and change locale @admin @access
- Location: apps\frontend\e2e\admin\admin.gherkin.spec.ts:16:7

# Error details

```
Error: expect(received).toBeTruthy()

Received: false
```

# Test source

```ts
  1  | import type { APIRequestContext, BrowserContext } from '@playwright/test';
  2  | import { expect } from '@playwright/test';
  3  | import { authTestIds } from './auth-test-ids';
  4  | 
  5  | export const BACKEND_BASE_URL = process.env.BACKEND_URL ?? 'http://127.0.0.1:3333';
  6  | export const DEFAULT_PASSWORD = process.env.E2E_PASSWORD ?? 'E2e$Test1';
  7  | 
  8  | export type TestUserRole = 'USER' | 'ADMIN';
  9  | 
  10 | export type TestUser = {
  11 |   readonly email: string;
  12 |   readonly password: string;
  13 |   readonly role: TestUserRole;
  14 | };
  15 | 
  16 | export async function isBackendReachable(request: APIRequestContext): Promise<boolean> {
  17 |   try {
  18 |     const response = await request.get(BACKEND_BASE_URL);
  19 |     return response.status() < 500;
  20 |   } catch {
  21 |     return false;
  22 |   }
  23 | }
  24 | 
  25 | export function buildTestUser(role: TestUserRole, seed: string): TestUser {
  26 |   return {
  27 |     email: `${role.toLowerCase()}-${seed}-${Date.now()}@example.com`,
  28 |     password: DEFAULT_PASSWORD,
  29 |     role,
  30 |   };
  31 | }
  32 | 
  33 | export async function registerUser(api: APIRequestContext, user: TestUser): Promise<void> {
  34 |   const response = await api.post(`${BACKEND_BASE_URL}/auth/signup`, {
  35 |     data: {
  36 |       email: user.email,
  37 |       password: user.password,
  38 |       firstName: user.role === 'ADMIN' ? 'Admin' : 'User',
  39 |       lastName: 'E2E',
  40 |     },
  41 |   });
  42 | 
  43 |   const allowedStatuses = new Set([200, 201, 409]);
> 44 |   expect(allowedStatuses.has(response.status())).toBeTruthy();
     |                                                  ^ Error: expect(received).toBeTruthy()
  45 | 
  46 |   if (user.role === 'ADMIN') {
  47 |     const { promoteUserToAdmin } = await import('./test-user-store');
  48 |     await promoteUserToAdmin(user.email);
  49 |   }
  50 | }
  51 | 
  52 | export async function signInViaApi(
  53 |   api: APIRequestContext,
  54 |   context: BrowserContext,
  55 |   user: TestUser
  56 | ): Promise<void> {
  57 |   const response = await api.post(`${BACKEND_BASE_URL}/auth/signin`, {
  58 |     data: {
  59 |       email: user.email,
  60 |       password: user.password,
  61 |     },
  62 |   });
  63 | 
  64 |   expect(response.ok()).toBeTruthy();
  65 |   const payload = (await response.json()) as { access_token?: string };
  66 |   expect(payload.access_token).toBeTruthy();
  67 | 
  68 |   await context.addCookies([
  69 |     {
  70 |       name: 'access_token',
  71 |       value: payload.access_token!,
  72 |       domain: '127.0.0.1',
  73 |       path: '/',
  74 |       httpOnly: true,
  75 |       sameSite: 'Lax',
  76 |     },
  77 |   ]);
  78 | }
  79 | 
  80 | export async function expectLockoutWarningVisible(
  81 |   page: import('@playwright/test').Page
  82 | ): Promise<void> {
  83 |   await expect(page.getByTestId(authTestIds.signinBlockedAlert)).toBeVisible();
  84 | }
  85 | 
```