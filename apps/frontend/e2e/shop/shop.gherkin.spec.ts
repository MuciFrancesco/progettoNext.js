import { expect, test } from '@playwright/test';
import {
  buildTestUser,
  isBackendReachable,
  registerUser,
  signInViaApi,
} from '../utils/support/auth-api';

test.describe('Shop gherkin scenarios @gherkin', () => {
  test('Scenario: Signed-in user with an empty cart is redirected back to the cart @shop @checkout @guest', async ({
    page,
    request,
    context,
  }) => {
    test.skip(
      !(await isBackendReachable(request)),
      'Backend non raggiungibile per scenario checkout utente autenticato.'
    );

    const user = buildTestUser('USER', 'empty-checkout');

    await test.step('Given a signed-in user opens the checkout page with an empty cart', async () => {
      await registerUser(request, user);
      await signInViaApi(request, context, user);
      await page.goto('/checkout');
    });

    await test.step('Then the user is redirected to the cart page', async () => {
      await expect(page.getByTestId('cart-page')).toBeVisible();
    });
  });

  test('Scenario: Signed-in user adds an available product and reaches checkout @shop @checkout @catalog', async ({
    page,
    request,
    context,
  }) => {
    test.skip(
      !(await isBackendReachable(request)),
      'Backend non raggiungibile per scenario checkout utente autenticato.'
    );

    const user = buildTestUser('USER', 'catalog-checkout');

    await test.step('Given a signed-in user opens the catalog', async () => {
      await registerUser(request, user);
      await signInViaApi(request, context, user);
      await page.goto('/');
      await expect(page.getByTestId('product-catalog')).toBeVisible();
    });

    await test.step('When the user adds an available product to the cart', async () => {
      const addButton = page.getByTestId(/^add-to-cart-/).first();
      test.skip((await addButton.count()) === 0, 'No available products in the current test dataset');
      await addButton.click();
    });

    await test.step('And the user proceeds to checkout from the cart', async () => {
      await page.goto('/cart');
      await expect(page.getByTestId('cart-page')).toBeVisible();
      await page.getByTestId('cart-checkout-button').click();
    });

    await test.step('Then the checkout page is visible', async () => {
      await expect(page.getByTestId('checkout-page')).toBeVisible();
    });
  });
});
