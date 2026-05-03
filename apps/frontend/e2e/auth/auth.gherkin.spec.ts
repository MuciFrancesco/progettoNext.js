import { test } from '@playwright/test';
import {
  givenRegisteredUserExists,
  givenVisitorOnAuthPage,
  thenVisitorSeesAccountBlockedWarning,
  thenVisitorSeesPasswordStrengthError,
  whenVisitorSubmitsWeakPassword,
  whenVisitorSubmitsWrongCredentialsNTimes,
  whenVisitorSwitchesToSignup,
} from './auth.steps';
import { isBackendReachable } from '../utils/support/auth-api';

test.describe('Auth gherkin scenarios @gherkin', () => {
  test('Scenario: Visitor switches to sign up and gets weak password validation @auth @validation', async ({
    page,
  }) => {
    await test.step('Given the visitor is on the auth page', async () => {
      await givenVisitorOnAuthPage(page);
    });

    await test.step('When the visitor switches to sign up mode', async () => {
      await whenVisitorSwitchesToSignup(page);
    });

    await test.step('And the visitor submits sign up with weak password "weak"', async () => {
      await whenVisitorSubmitsWeakPassword(page, 'weak');
    });

    await test.step('Then the visitor sees a password strength validation error', async () => {
      await thenVisitorSeesPasswordStrengthError(page);
    });
  });

  test('Scenario: Registered user gets blocked after repeated failed sign in attempts @auth @lockout', async ({
    page,
    request,
  }) => {
    test.skip(
      !(await isBackendReachable(request)),
      'Backend non raggiungibile per scenario lockout.'
    );

    const email = `lockout-${Date.now()}@example.com`;

    await test.step('Given a registered user exists for lockout checks', async () => {
      await givenRegisteredUserExists(request, email);
    });

    await test.step('And the visitor is on the auth page', async () => {
      await givenVisitorOnAuthPage(page);
    });

    await test.step('When the visitor submits wrong credentials 5 times', async () => {
      await whenVisitorSubmitsWrongCredentialsNTimes(page, email, 5);
    });

    await test.step('Then the visitor sees the account blocked warning', async () => {
      await thenVisitorSeesAccountBlockedWarning(page);
    });
  });
});
