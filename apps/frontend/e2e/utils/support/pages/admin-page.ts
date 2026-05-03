import { expect, type Page } from '@playwright/test';
import { adminPageTestIds, localeSwitcherTestIds, userPageTestIds } from '../auth-test-ids';

export class AdminPage {
  constructor(private readonly page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto('/dashboard');
  }

  async expectVisible(): Promise<void> {
    await expect(this.page.getByTestId(adminPageTestIds.page)).toBeVisible();
    await expect(this.page.getByTestId(adminPageTestIds.title)).toBeVisible();
  }

  async expectRedirectedToUserArea(): Promise<void> {
    await expect(this.page.getByTestId(userPageTestIds.page)).toBeVisible();
  }

  async expectRedirectedToAuth(): Promise<void> {
    await expect(this.page).toHaveURL(/\/$/);
  }

  async changeLocale(locale: string): Promise<void> {
    await this.page.getByTestId(localeSwitcherTestIds.admin.select).selectOption(locale);
  }
}
