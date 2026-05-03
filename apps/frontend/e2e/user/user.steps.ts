import { expect, type APIRequestContext, type Page } from '@playwright/test';
import { authTestIds, localeSwitcherTestIds } from '../utils/support/auth-test-ids';
import { AuthPage } from '../utils/support/pages/auth-page';
import { AdminPage } from '../utils/support/pages/admin-page';
import { UserPage } from '../utils/support/pages/user-page';
import {
  buildTestUser,
  isBackendReachable,
  registerUser,
  signInViaApi,
} from '../utils/support/auth-api';

export async function givenBackendIsReachable(request: APIRequestContext): Promise<void> {
  expect(await isBackendReachable(request)).toBeTruthy();
}

export async function whenVisitorSignsUpAsStandardUser(page: Page): Promise<void> {
  const authPage = new AuthPage(page);
  const user = buildTestUser('USER', 'signup');
  await authPage.signUp(user);
}

export async function thenVisitorReachesUserArea(page: Page): Promise<void> {
  const userPage = new UserPage(page);
  await userPage.expectVisible();
}

export async function givenSignedInStandardUserExists(
  page: Page,
  request: APIRequestContext
): Promise<void> {
  const user = buildTestUser('USER', 'user-area');
  await registerUser(request, user);
  await signInViaApi(request, page.context(), user);
  await page.goto('/user');
  await new UserPage(page).expectVisible();
}

export async function whenUserSwitchesLocale(page: Page, locale: string): Promise<void> {
  const userPage = new UserPage(page);
  await userPage.changeLocale(locale);
  await userPage.expectLocale(locale);
}

export async function whenUserSignsOut(page: Page): Promise<void> {
  const userPage = new UserPage(page);
  await userPage.signOut();
}

export async function thenVisitorReturnsToAuthPage(page: Page): Promise<void> {
  await expect(page.getByTestId(authTestIds.signinForm)).toBeVisible();
}

export async function whenUserOpensAdminDashboard(page: Page): Promise<void> {
  const adminPage = new AdminPage(page);
  await adminPage.goto();
}

export async function thenVisitorRedirectedToUserArea(page: Page): Promise<void> {
  await new AdminPage(page).expectRedirectedToUserArea();
  await expect(page.getByTestId(localeSwitcherTestIds.user.select)).toBeVisible();
}

export async function givenAnonymousVisitor(page: Page): Promise<void> {
  await page.context().clearCookies();
}

export async function thenVisitorRedirectedToAuthPage(page: Page): Promise<void> {
  await new AdminPage(page).expectRedirectedToAuth();
  await expect(page.getByTestId(authTestIds.signinForm)).toBeVisible();
}
