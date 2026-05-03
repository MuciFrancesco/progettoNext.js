import { expect, type APIRequestContext, type Page } from '@playwright/test';
import { authTestIds } from '../utils/support/auth-test-ids';
import { AuthPage } from '../utils/support/pages/auth-page';
import {
  BACKEND_BASE_URL,
  DEFAULT_PASSWORD,
  expectLockoutWarningVisible,
} from '../utils/support/auth-api';

export async function givenVisitorOnAuthPage(page: Page): Promise<void> {
  const authPage = new AuthPage(page);
  await authPage.goto();
  await expect(page.getByTestId(authTestIds.signinForm)).toBeVisible();
}

export async function whenVisitorSwitchesToSignup(page: Page): Promise<void> {
  const authPage = new AuthPage(page);
  await authPage.switchToSignup();
}

export async function whenVisitorSubmitsWeakPassword(
  page: Page,
  weakPassword: string
): Promise<void> {
  const authPage = new AuthPage(page);
  await authPage.submitWeakSignup(weakPassword);
}

export async function thenVisitorSeesPasswordStrengthError(page: Page): Promise<void> {
  const authPage = new AuthPage(page);
  await authPage.expectWeakPasswordState();
}

export async function givenRegisteredUserExists(
  api: APIRequestContext,
  email: string
): Promise<void> {
  await api.post(`${BACKEND_BASE_URL}/auth/signup`, {
    data: {
      email,
      password: DEFAULT_PASSWORD,
      firstName: 'Playwright',
      lastName: 'User',
    },
  });
}

export async function whenVisitorSubmitsWrongCredentialsNTimes(
  page: Page,
  email: string,
  attempts: number
): Promise<void> {
  const authPage = new AuthPage(page);
  await authPage.submitWrongCredentials(email, attempts);
}

export async function thenVisitorSeesAccountBlockedWarning(page: Page): Promise<void> {
  await expectLockoutWarningVisible(page);
  await expect(page.getByTestId(authTestIds.signinEmailInput)).toBeDisabled();
  await expect(page.getByTestId(authTestIds.signinPasswordInput)).toBeDisabled();
}
