import { expect, type Page } from '@playwright/test';
import { localeSwitcherTestIds, userPageTestIds } from '../auth-test-ids';

export class UserPage {
  constructor(private readonly page: Page) {}

  async expectVisible(): Promise<void> {
    await expect(this.page.getByTestId(userPageTestIds.page)).toBeVisible();
    await expect(this.page.getByTestId(userPageTestIds.title)).toBeVisible();
  }

  async changeLocale(locale: string): Promise<void> {
    await this.page.getByTestId(localeSwitcherTestIds.user.select).selectOption(locale);
  }

  async expectLocale(locale: string): Promise<void> {
    await expect(this.page.getByTestId(localeSwitcherTestIds.user.select)).toHaveValue(locale);
  }

  async signOut(): Promise<void> {
    await this.page.getByTestId(userPageTestIds.signoutButton).click();
  }
}
