import { test } from '@playwright/test';
import { isBackendReachable } from '../utils/support/auth-api';
import {
  givenAnonymousVisitor,
  givenBackendIsReachable,
  givenSignedInStandardUserExists,
  thenVisitorReturnsToAuthPage,
  thenVisitorReachesUserArea,
  thenVisitorRedirectedToAuthPage,
  thenVisitorRedirectedToUserArea,
  whenUserOpensAdminDashboard,
  whenUserSignsOut,
  whenUserSwitchesLocale,
  whenVisitorSignsUpAsStandardUser,
} from './user.steps';

test.describe('User gherkin scenarios @gherkin', () => {
  test('Scenario: Visitor signs up and lands in user area @user @signup', async ({
    page,
    request,
  }) => {
    test.skip(
      !(await isBackendReachable(request)),
      'Backend non raggiungibile per scenario signup.'
    );

    await test.step('Given the backend is reachable', async () => {
      await givenBackendIsReachable(request);
    });

    await test.step('When the visitor signs up as a standard user', async () => {
      await whenVisitorSignsUpAsStandardUser(page);
    });

    await test.step('Then the visitor reaches the user area', async () => {
      await thenVisitorReachesUserArea(page);
    });
  });

  test('Scenario: Authenticated user changes locale and signs out @user @locale', async ({
    page,
    request,
  }) => {
    test.skip(
      !(await isBackendReachable(request)),
      'Backend non raggiungibile per scenario locale.'
    );

    await test.step('Given a signed-in standard user exists', async () => {
      await givenSignedInStandardUserExists(page, request);
    });

    await test.step('When the user switches locale to "en"', async () => {
      await whenUserSwitchesLocale(page, 'en');
    });

    await test.step('And the user signs out', async () => {
      await whenUserSignsOut(page);
    });

    await test.step('Then the visitor returns to the auth page', async () => {
      await thenVisitorReturnsToAuthPage(page);
    });
  });

  test('Scenario: Standard user cannot access the admin dashboard @access @user', async ({
    page,
    request,
  }) => {
    test.skip(
      !(await isBackendReachable(request)),
      'Backend non raggiungibile per scenario access user.'
    );

    await test.step('Given a signed-in standard user exists', async () => {
      await givenSignedInStandardUserExists(page, request);
    });

    await test.step('When the user opens the admin dashboard', async () => {
      await whenUserOpensAdminDashboard(page);
    });

    await test.step('Then the user is redirected to the user area', async () => {
      await thenVisitorRedirectedToUserArea(page);
    });
  });

  test('Scenario: Anonymous visitor cannot access the admin dashboard @access @anonymous', async ({
    page,
  }) => {
    await test.step('Given the visitor is not authenticated', async () => {
      await givenAnonymousVisitor(page);
    });

    await test.step('When the visitor opens the admin dashboard', async () => {
      await whenUserOpensAdminDashboard(page);
    });

    await test.step('Then the visitor is redirected to the auth page', async () => {
      await thenVisitorRedirectedToAuthPage(page);
    });
  });
});
