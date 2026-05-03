import { test } from '@playwright/test';
import {
  buildTestUser,
  isBackendReachable,
  registerUser,
  signInViaApi,
} from '../utils/support/auth-api';
import { AdminPage } from '../utils/support/pages/admin-page';
import { disposeTestUserStore } from '../utils/support/test-user-store';

test.describe('Admin protected flows', () => {
  test.afterAll(async () => {
    await disposeTestUserStore();
  });

  test('Admin can open dashboard, see user grid and change locale @admin @access', async ({
    page,
    request,
    context,
  }) => {
    test.skip(
      !(await isBackendReachable(request)),
      'Backend non raggiungibile per scenario admin.'
    );

    const adminUser = buildTestUser('ADMIN', 'dashboard');
    await registerUser(request, adminUser);
    await signInViaApi(request, context, adminUser);

    const adminPage = new AdminPage(page);
    await adminPage.goto();
    await adminPage.expectVisible();
    await adminPage.changeLocale('fr');
    await adminPage.expectVisible();
  });
});
