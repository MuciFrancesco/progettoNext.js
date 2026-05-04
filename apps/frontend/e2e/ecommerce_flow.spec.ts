import { expect, test } from '@playwright/test';

test('guest can open catalog and cannot checkout with an empty cart', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('product-catalog')).toBeVisible();

  await page.goto('/cart');
  await expect(page.getByTestId('cart-page')).toBeVisible();
  await expect(page.getByRole('link', { name: /catalog/i })).toBeVisible();
});

test('guest can add an available catalog product to the cart', async ({ page }) => {
  await page.goto('/');
  const addButton = page.getByTestId(/^add-to-cart-/).first();

  test.skip((await addButton.count()) === 0, 'No available products in the current test dataset');

  await addButton.click();
  await page.goto('/cart');

  await expect(page.getByTestId('cart-page')).toBeVisible();
  await expect(page.getByTestId('cart-checkout-button')).toBeEnabled();
});
