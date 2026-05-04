# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: user\user.gherkin.spec.ts >> User gherkin scenarios @gherkin >> Scenario: Standard user cannot access the admin dashboard @access @user
- Location: e2e\user\user.gherkin.spec.ts:66:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByTestId('user-locale-switcher-select')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByTestId('user-locale-switcher-select')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - button "Open Next.js Dev Tools" [ref=e7] [cursor=pointer]:
    - img [ref=e8]
  - alert [ref=e11]
  - main [ref=e12]:
    - heading "Pagina non trovata" [level=1] [ref=e13]
    - paragraph [ref=e14]: La risorsa richiesta non esiste oppure non e disponibile.
    - button "Torna alla pagina precedente" [ref=e15] [cursor=pointer]
```

# Test source

```ts
  1  | import { expect, type APIRequestContext, type Page } from '@playwright/test';
  2  | import { authTestIds, localeSwitcherTestIds } from '../utils/support/auth-test-ids';
  3  | import { AuthPage } from '../utils/support/pages/auth-page';
  4  | import { AdminPage } from '../utils/support/pages/admin-page';
  5  | import { UserPage } from '../utils/support/pages/user-page';
  6  | import {
  7  |   buildTestUser,
  8  |   isBackendReachable,
  9  |   registerUser,
  10 |   signInViaApi,
  11 | } from '../utils/support/auth-api';
  12 | 
  13 | export async function givenBackendIsReachable(request: APIRequestContext): Promise<void> {
  14 |   expect(await isBackendReachable(request)).toBeTruthy();
  15 | }
  16 | 
  17 | export async function whenVisitorSignsUpAsStandardUser(page: Page): Promise<void> {
  18 |   const authPage = new AuthPage(page);
  19 |   const user = buildTestUser('USER', 'signup');
  20 |   await authPage.signUp(user);
  21 | }
  22 | 
  23 | export async function thenVisitorReachesUserArea(page: Page): Promise<void> {
  24 |   const userPage = new UserPage(page);
  25 |   await userPage.expectVisible();
  26 | }
  27 | 
  28 | export async function givenSignedInStandardUserExists(
  29 |   page: Page,
  30 |   request: APIRequestContext
  31 | ): Promise<void> {
  32 |   const user = buildTestUser('USER', 'user-area');
  33 |   await registerUser(request, user);
  34 |   await signInViaApi(request, page.context(), user);
  35 |   await page.goto('/user');
  36 |   await new UserPage(page).expectVisible();
  37 | }
  38 | 
  39 | export async function whenUserSwitchesLocale(page: Page, locale: string): Promise<void> {
  40 |   const userPage = new UserPage(page);
  41 |   await userPage.changeLocale(locale);
  42 |   await userPage.expectLocale(locale);
  43 | }
  44 | 
  45 | export async function whenUserSignsOut(page: Page): Promise<void> {
  46 |   const userPage = new UserPage(page);
  47 |   await userPage.signOut();
  48 | }
  49 | 
  50 | export async function thenVisitorReturnsToAuthPage(page: Page): Promise<void> {
  51 |   await expect(page.getByTestId(authTestIds.signinForm)).toBeVisible();
  52 | }
  53 | 
  54 | export async function whenUserOpensAdminDashboard(page: Page): Promise<void> {
  55 |   const adminPage = new AdminPage(page);
  56 |   await adminPage.goto();
  57 | }
  58 | 
  59 | export async function thenVisitorRedirectedToUserArea(page: Page): Promise<void> {
  60 |   await new AdminPage(page).expectRedirectedToUserArea();
> 61 |   await expect(page.getByTestId(localeSwitcherTestIds.user.select)).toBeVisible();
     |                                                                     ^ Error: expect(locator).toBeVisible() failed
  62 | }
  63 | 
  64 | export async function givenAnonymousVisitor(page: Page): Promise<void> {
  65 |   await page.context().clearCookies();
  66 | }
  67 | 
  68 | export async function thenVisitorRedirectedToAuthPage(page: Page): Promise<void> {
  69 |   await new AdminPage(page).expectRedirectedToAuth();
  70 |   await expect(page.getByTestId(authTestIds.signinForm)).toBeVisible();
  71 | }
  72 | 
```