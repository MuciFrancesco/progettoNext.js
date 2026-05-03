import { expect, type Page } from '@playwright/test';
import { authTestIds, homeTestIds, localeSwitcherTestIds } from '../auth-test-ids';

export class AuthPage {
  constructor(private readonly page: Page) {}

  async goto(mode: 'signin' | 'signup' = 'signin'): Promise<void> {
    const suffix = mode === 'signup' ? '?mode=signup' : '';
    await this.page.goto(`/${suffix}`);
    await expect(this.page.getByTestId(homeTestIds.page)).toBeVisible();
    await expect(this.page.getByTestId(authTestIds.root)).toBeVisible();
  }

  async switchToSignup(): Promise<void> {
    await this.goto('signup');
    await expect(this.page.getByTestId(authTestIds.signupForm)).toBeVisible();
  }

  async submitWeakSignup(password: string): Promise<void> {
    await this.page.getByTestId(authTestIds.signupFirstNameInput).fill('Play');
    await this.page.getByTestId(authTestIds.signupLastNameInput).fill('Wright');
    await this.page.getByTestId(authTestIds.signupEmailInput).fill(`pw-${Date.now()}@example.com`);
    await this.page.getByTestId(authTestIds.signupPasswordInput).fill(password);
    await this.page.getByTestId(authTestIds.signupPasswordInput).blur();
  }

  async expectWeakPasswordState(): Promise<void> {
    await expect(this.page.getByTestId(authTestIds.signupPasswordInput)).toHaveAttribute(
      'data-validation-state',
      'weak'
    );
    await expect(this.page.getByTestId(authTestIds.signupPasswordError)).toHaveAttribute(
      'data-validation-state',
      'weak'
    );
  }

  async signUp(user: { email: string; password: string }): Promise<void> {
    await this.goto('signup');
    await expect(this.page.getByTestId(authTestIds.signupForm)).toBeVisible();
    await this.page.getByTestId(authTestIds.signupFirstNameInput).fill('Play');
    await this.page.getByTestId(authTestIds.signupLastNameInput).fill('Wright');
    await this.page.getByTestId(authTestIds.signupEmailInput).fill(user.email);
    await this.page.getByTestId(authTestIds.signupPasswordInput).fill(user.password);
    await this.page.getByTestId(authTestIds.signupSubmitButton).click();
  }

  async signIn(user: { email: string; password: string }): Promise<void> {
    await this.goto();
    await this.page.getByTestId(authTestIds.signinEmailInput).fill(user.email);
    await this.page.getByTestId(authTestIds.signinPasswordInput).fill(user.password);
    await this.page.getByTestId(authTestIds.signinSubmitButton).click();
  }

  async submitWrongCredentials(email: string, attempts: number): Promise<void> {
    for (let i = 0; i < attempts; i += 1) {
      await this.page.getByTestId(authTestIds.signinEmailInput).fill(email);
      await this.page.getByTestId(authTestIds.signinPasswordInput).fill('Wrong$Pass1');
      await this.page.getByTestId(authTestIds.signinSubmitButton).click();
      await expect(this.page.getByTestId(authTestIds.serverError)).toBeVisible();
    }
  }

  async changeLocale(locale: string): Promise<void> {
    await this.page.getByTestId(localeSwitcherTestIds.home.select).selectOption(locale);
  }
}
