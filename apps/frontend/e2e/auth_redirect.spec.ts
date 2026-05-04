import { expect, test } from '@playwright/test';
import {
  buildTestUser,
  isBackendReachable,
  registerUser,
} from './utils/support/auth-api';
import { authTestIds } from './utils/support/auth-test-ids';

test('user login redirects to the public catalog', async ({ page, request }) => {
  test.skip(!(await isBackendReachable(request)), 'Backend is not reachable');
  const user = buildTestUser('USER', 'catalog-redirect');
  await registerUser(request, user);

  await page.goto('/login?mode=signin');
  await page.getByTestId(authTestIds.signinEmailInput).fill(user.email);
  await page.getByTestId(authTestIds.signinPasswordInput).fill(user.password);
  await page.getByTestId(authTestIds.signinSubmitButton).click();

  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByTestId('product-catalog')).toBeVisible();
});

test('admin login redirects to the admin dashboard', async ({ page, request }) => {
  test.skip(!(await isBackendReachable(request)), 'Backend is not reachable');
  const admin = buildTestUser('ADMIN', 'dashboard-redirect');
  await registerUser(request, admin);

  await page.goto('/login?mode=signin');
  await page.getByTestId(authTestIds.signinEmailInput).fill(admin.email);
  await page.getByTestId(authTestIds.signinPasswordInput).fill(admin.password);
  await page.getByTestId(authTestIds.signinSubmitButton).click();

  await expect(page).toHaveURL(/\/dashboard$/);
});
