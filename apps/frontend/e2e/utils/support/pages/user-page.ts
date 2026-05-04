import { expect, type Page } from '@playwright/test';
import { userPageTestIds } from '../auth-test-ids';

export class UserPage {
  constructor(private readonly page: Page) {}

  async expectVisible(): Promise<void> {
    await expect(this.page.getByTestId(userPageTestIds.page)).toBeVisible();
    await expect(this.page.getByTestId(userPageTestIds.title)).toBeVisible();
  }

  async changeLocale(locale: string): Promise<void> {
    await this.page.context().addCookies([
      {
        name: 'locale',
        value: locale,
        domain: '127.0.0.1',
        path: '/',
      },
    ]);
    await this.page.reload();
  }

  async expectLocale(locale: string): Promise<void> {
    await expect(this.page.locator('html')).toHaveAttribute('lang', locale);
  }

  async signOut(): Promise<void> {
    await this.page.getByTestId(userPageTestIds.signoutButton).click();
  }
}
